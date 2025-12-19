import re

# Read the file  
with open(r'd:\DrSnuggles\src\renderer\components\DrSnugglesControlCenter.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the end of the component (line with }; after the component ends)
# and the start of the CSS animations section
component_end_pattern = r'(\}\);\n\};)\n\n//\sCSS\sAnimations\n'
css_animations_start = '// CSS Animations\nconst styleSheet = document.createElement'

# Split at component end
parts = content.split('});', 1)
if len(parts) == 2:
    before_component_end = parts[0] + '});'
    after_component_end = parts[1]
    
    # Find where CSS animations actually start
    if 'const styleSheet = document.createElement' in after_component_end:
        css_start_idx = after_component_end.index('// CSS Animations\nconst styleSheet')
        clean_after = '\n\n' + after_component_end[css_start_idx:]
        
        # Reconstruct the file
        new_content = before_component_end + clean_after
        
        # Write back
        with open(r'd:\DrSnuggles\src\renderer\components\DrSnugglesControlCenter.tsx', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("Successfully removed duplicate styles object content")
    else:
        print("Could not find CSS animations section")
else:
    print("Could not find component end")
