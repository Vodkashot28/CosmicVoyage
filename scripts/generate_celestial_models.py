
"""
Generate all 24 remaining celestial body .glb models using Blender Python API
Requires: Blender 3.0+ with Python API enabled
Run: blender --background --python generate_celestial_models.py
"""

import bpy
import math
import os
from mathlib import Vector

# Clear default scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

def create_planet_material(name, base_color, roughness=0.7, metallic=0.0, emission_strength=0.0):
    """Create a PBR material for a celestial body"""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    
    # Create shader nodes
    output = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    
    # Set material properties
    bsdf.inputs['Base Color'].default_value = base_color + (1.0,)
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Metallic'].default_value = metallic
    if emission_strength > 0:
        bsdf.inputs['Emission'].default_value = base_color + (1.0,)
        bsdf.inputs['Emission Strength'].default_value = emission_strength
    
    # Link nodes
    mat.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    
    return mat

def add_surface_detail(obj, scale=1.0, detail_level=3):
    """Add procedural surface detail using displacement"""
    # Add subdivision surface
    subdiv = obj.modifiers.new('Subdivision', 'SUBSURF')
    subdiv.levels = detail_level
    subdiv.render_levels = detail_level
    
    # Add displacement for surface detail
    displace = obj.modifiers.new('Displace', 'DISPLACE')
    
    # Create noise texture
    tex = bpy.data.textures.new('NoiseTexture', 'VORONOI')
    tex.noise_scale = 2.0 * scale
    displace.texture = tex
    displace.strength = 0.1 * scale

def create_sphere(name, radius, color, roughness=0.7, metallic=0.0, add_detail=True):
    """Create a basic sphere for planets/asteroids"""
    bpy.ops.mesh.primitive_uv_sphere_add(radius=radius, segments=64, ring_count=32)
    obj = bpy.context.active_object
    obj.name = name
    
    # Apply material
    mat = create_planet_material(f"{name}_mat", color, roughness, metallic)
    obj.data.materials.append(mat)
    
    if add_detail:
        add_surface_detail(obj, radius)
    
    return obj

def create_asteroid(name, radius, color, irregularity=0.3):
    """Create an irregular asteroid shape"""
    bpy.ops.mesh.primitive_ico_sphere_add(radius=radius, subdivisions=3)
    obj = bpy.context.active_object
    obj.name = name
    
    # Make it irregular using displacement
    displace = obj.modifiers.new('Irregular', 'DISPLACE')
    tex = bpy.data.textures.new(f'{name}_tex', 'VORONOI')
    tex.noise_scale = 3.0
    displace.texture = tex
    displace.strength = irregularity * radius
    
    # Apply material
    mat = create_planet_material(f"{name}_mat", color, roughness=0.9, metallic=0.2)
    obj.data.materials.append(mat)
    
    return obj

def create_saturn_rings(planet_radius):
    """Create Saturn's ring system"""
    bpy.ops.mesh.primitive_torus_add(
        major_radius=planet_radius * 2.0,
        minor_radius=planet_radius * 0.8,
        major_segments=128,
        minor_segments=4
    )
    rings = bpy.context.active_object
    rings.name = "SaturnRings"
    rings.rotation_euler[0] = math.radians(90)
    
    # Ring material (golden, semi-transparent)
    mat = create_planet_material("RingMat", (0.9, 0.85, 0.6), roughness=0.5)
    rings.data.materials.append(mat)
    
    return rings

def export_glb(obj, filename):
    """Export object as GLB with Draco compression"""
    # Select only this object
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    
    # Export path
    output_path = os.path.join(os.getcwd(), 'client', 'public', 'models', filename)
    
    # Export as GLB
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=True,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=10,
        export_materials='EXPORT',
        export_colors=True,
        export_normals=True,
        export_apply=True
    )
    
    print(f"✅ Exported: {filename}")

# Main Planets
def generate_planets():
    """Generate main planets (Mars through Neptune)"""
    
    # Mars - Red rocky planet
    mars = create_sphere("Mars", 1.0, (0.8, 0.3, 0.1), roughness=0.8)
    export_glb(mars, "mars.glb")
    bpy.data.objects.remove(mars)
    
    # Jupiter - Gas giant with bands
    jupiter = create_sphere("Jupiter", 2.5, (0.78, 0.55, 0.23), roughness=0.6, add_detail=False)
    export_glb(jupiter, "jupiter.glb")
    bpy.data.objects.remove(jupiter)
    
    # Saturn - Ringed planet
    saturn = create_sphere("Saturn", 2.2, (0.9, 0.85, 0.6), roughness=0.6, add_detail=False)
    rings = create_saturn_rings(2.2)
    # Parent rings to planet
    rings.parent = saturn
    export_glb(saturn, "saturn.glb")
    bpy.data.objects.remove(saturn)
    bpy.data.objects.remove(rings)
    
    # Uranus - Pale cyan ice giant
    uranus = create_sphere("Uranus", 1.8, (0.3, 0.8, 0.9), roughness=0.5)
    export_glb(uranus, "uranus.glb")
    bpy.data.objects.remove(uranus)
    
    # Neptune - Deep blue ice giant
    neptune = create_sphere("Neptune", 1.7, (0.25, 0.4, 0.95), roughness=0.5)
    export_glb(neptune, "neptune.glb")
    bpy.data.objects.remove(neptune)

def generate_dwarf_planets():
    """Generate 7 dwarf planets"""
    
    dwarf_planets = [
        ("Pluto", 0.4, (0.73, 0.73, 0.73)),
        ("Ceres", 0.5, (0.6, 0.55, 0.5)),
        ("Eris", 0.38, (0.85, 0.85, 0.88)),
        ("Haumea", 0.44, (0.7, 0.75, 0.8)),  # Elongated in reality
        ("Makemake", 0.42, (0.65, 0.6, 0.55)),
        ("Gonggong", 0.36, (0.55, 0.5, 0.6)),
        ("Orcus", 0.34, (0.5, 0.55, 0.6))
    ]
    
    for name, radius, color in dwarf_planets:
        obj = create_sphere(name, radius, color, roughness=0.85)
        export_glb(obj, f"{name.lower()}.glb")
        bpy.data.objects.remove(obj)

def generate_asteroids():
    """Generate 13 asteroids with irregular shapes"""
    
    asteroids = [
        ("Vesta", 0.24, (0.55, 0.5, 0.45)),
        ("Pallas", 0.26, (0.5, 0.48, 0.46)),
        ("Juno", 0.22, (0.52, 0.5, 0.48)),
        ("Hygiea", 0.28, (0.45, 0.43, 0.41)),
        ("Astraea", 0.18, (0.6, 0.55, 0.5)),
        ("Apophis", 0.16, (0.4, 0.38, 0.36)),
        ("Bennu", 0.14, (0.35, 0.33, 0.31)),
        ("Itokawa", 0.12, (0.5, 0.45, 0.4)),
        ("Eros", 0.18, (0.58, 0.52, 0.46)),
        ("Psyche", 0.28, (0.7, 0.65, 0.6), True),  # Metallic
        ("Varda", 0.2, (0.48, 0.46, 0.44)),
        ("Oumuamua", 0.16, (0.42, 0.4, 0.38)),  # Elongated
        ("Halley", 0.2, (0.3, 0.28, 0.26))  # Comet core
    ]
    
    for data in asteroids:
        name, radius, color = data[:3]
        is_metallic = data[3] if len(data) > 3 else False
        
        obj = create_asteroid(name, radius, color, irregularity=0.4)
        
        # Psyche is metallic
        if is_metallic:
            obj.data.materials[0].node_tree.nodes['Principled BSDF'].inputs['Metallic'].default_value = 0.8
            obj.data.materials[0].node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.3
        
        export_glb(obj, f"{name.lower()}.glb")
        bpy.data.objects.remove(obj)

# Generate all models
print("🚀 Starting celestial body model generation...")

print("\n📍 Generating main planets...")
generate_planets()

print("\n🪐 Generating dwarf planets...")
generate_dwarf_planets()

print("\n☄️ Generating asteroids...")
generate_asteroids()

print("\n✅ All 24 celestial body models generated successfully!")
print("📁 Models saved to: client/public/models/")
