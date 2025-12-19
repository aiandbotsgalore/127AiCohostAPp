# Generate images using Imagen  |  Gemini API  |  Google AI for Developers

Source: https://ai.google.dev/gemini-api/docs/imagen

/\* Styles inlined from /site-assets/css/models.css \*/ :root { --gemini-api-table-font-color: #3c4043; --gemini-api-model-font: 'Google Sans Text', Roboto, sans-serif; --gemini-api-card-width: 17rem; --gemini-api-elevation-1dp: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2); --gemini-api-elevation-3dp: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12), 0 1px 8px 0 rgba(0, 0, 0, 0.2); } body\[theme="googledevai-theme"\] { --googledevai-button-gradient: var(--googledevai-button-gradient-light); } body\[theme="googledevai-theme"\].color-scheme--dark { --googledevai-button-gradient: var(--googledevai-button-gradient-dark); } .google-symbols { background: -webkit-linear-gradient(45deg, var(--googledevai-blue), var(--googledevai-purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; user-select: none; vertical-align: bottom; } /\* Cards \*/ @media only screen and (min-width: 625px) { .gemini-api-recommended { display: grid; grid-template-columns: repeat(3, 1fr); /\* Three equal-width columns \*/ grid-column-gap: 3rem; /\* Keep the gap between columns \*/ } } .gemini-api-recommended { width: 100%; /\* Take full width of parent \*/ margin: 0 auto; } .gemini-api-card { background: var(--devsite-background-1); border: 1px solid var(--googledevai-border-color); border-radius: 9px; box-shadow: var(--gemini-api-elevation-1dp); height: 23rem; margin: 1rem .5rem; padding: 1rem; transition: box-shadow 0.3s ease-in-out; width: var(--gemini-api-card-width); } .color-scheme--dark .gemini-api-card { background: #131314; border-color: #444746; } .gemini-api-card:hover { box-shadow: var(--gemini-api-elevation-3dp); } .gemini-api-card a:empty { display: block; position: relative; height: 23rem; width: var(--gemini-api-card-width); top: -22.8rem; left: -1rem; } .gemini-api-card a:empty:focus { border: 2px solid var(--devsite-primary-color); border-radius: 9px; } .gemini-api-card-title { font-family: "Google Sans", Roboto, sans-serif; font-size: 1.3rem; font-weight: 500; height: 1.5rem; margin-bottom: 2.5rem; line-height: 1.3rem; } .gemini-api-card-description { font-size: .9rem; height: 7.5rem; overflow: hidden; text-overflow: ellipsis; white-space: normal; } .gemini-api-card-bulletpoints { color: #757575; font-size: .8rem; height: 8.2rem; margin-left: 1rem; padding: 0; } .color-scheme--dark .gemini-api-card-bulletpoints { color: var(--devsite-primary-text-color); } .gemini-api-card-description, .gemini-api-card-bulletpoints { font-family: var(--gemini-api-model-font); } .gemini-api-card-bulletpoints li { line-height: 1rem; margin: .3rem 0; } /\* Tables \*/ .gemini-api-model-table, .gemini-api-model-table th { color: var(--gemini-api-table-font-color); font: .95rem var(--gemini-api-model-font); } .color-scheme--dark .gemini-api-model-table, .color-scheme--dark .gemini-api-model-table th { color: var(--devsite-primary-text-color); } .gemini-api-model-table th { font-weight: 500; } .gemini-api-model-table td:first-child { max-width: 0; } .gemini-api-model-table-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); grid-gap: 1rem .5rem; } .gemini-api-model-table section { display: inline-grid; } .gemini-api-model-table p { margin: 0 0 .5rem; } .gemini-api-model-table li { margin: 0; } .gemini-api-model-table ul { margin-top: .5rem; } .gemini-api-model-table .google-symbols { margin-right: .7rem; vertical-align: middle; } .gemini-api-supported, .gemini-api-not-supported, .gemini-api-experimental { border-radius: 8px; display: inline-block; font-size: .9rem; font-weight: 500; line-height: 1rem; padding: .3rem 0.5em; } .gemini-api-supported { background: #e6f4ea; /\* GM3 Green 50 \*/ color: #177d37; /\* GM3 Green 700 \*/ } .gemini-api-not-supported { background: #fce8e6; /\* GM3 Red 50 \*/ color: #c5221f; /\* GM3 Red 700 \*/ } .gemini-api-experimental { background: #e8def8; color: #4a4458; } .color-scheme--dark .gemini-api-supported { background: #177d37; /\* GM3 Green 700 \*/ color: #e6f4ea; /\* GM3 Green 50 \*/ } .color-scheme--dark .gemini-api-not-supported { background: #c5221f; /\* GM3 Red 700 \*/ color: #fce8e6; /\* GM3 Red 50 \*/ } /\* Buttons \*/ .gemini-api-model-button { background: var(--googledevai-button-gradient); background-size: 300% 300%; border-radius: 20rem; color: #001d35; font-family: var(--gemini-api-model-font); font-size: .9rem; font-weight: 500; padding: .6rem 1rem; text-align: center; text-decoration: none; transition: filter .2s ease-in-out, box-shadow .2s ease-in-out; } .gemini-api-model-button:hover{ animation: gradient 5s ease infinite; filter: brightness(.98); box-shadow: var(--gemini-api-elevation-1dp); } .gemini-api-model-button:focus { filter: brightness(.95); outline: #00639b solid 3px; outline-offset: 2px; text-decoration: none; } .gemini-api-model-button::before { content: 'spark'; font-family: 'Google Symbols'; padding-right: 0.5rem; vertical-align: middle; } @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } } .model-card { display: flex; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); transition: box-shadow 0.3s ease; } .color-scheme--dark .model-card { background-color: #3c4043; } .model-card:hover { box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); } .card-content { padding: 2.5rem; flex: 1; } .sub-heading-model { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 0.5rem 0; } .color-scheme--dark .sub-heading-model { color: var(--devsite-primary-text-color); } .card-content h2 { font-size: 2rem; font-weight: 500; margin: 0 0 1rem 0; } .description { font-size: 1rem; line-height: 1.6; color: #3c4043; margin: 0 0 1.5rem 0; } .color-scheme--dark .description { color: var(--devsite-primary-text-color); } .card-content a:not(.gemini-api-model-button) { color: #1a73e8; text-decoration: none; font-weight: 600; } .card-content a:hover { text-decoration: underline; } @media (max-width: 768px) { .model-card { flex-direction: column; } .card-content { padding: 1.5rem; } h1 { font-size: 2rem; } .card-content h2 { font-size: 1.5rem; } }

Gemini 3 Pro is here. [Try it for free in Google AI Studio](https://aistudio.google.com?model=gemini-3-pro-preview).

*   [Home](https://ai.google.dev/)
*   [Gemini API](https://ai.google.dev/gemini-api)
*   [Gemini API Docs](https://ai.google.dev/gemini-api/docs)

Send feedback

# Generate images using Imagen

Imagen is Google's high-fidelity image generation model, capable of generating realistic and high quality images from text prompts. All generated images include a SynthID watermark. To learn more about the available Imagen model variants, see the [Model versions](#model-versions) section.

**Note:** You can also generate images with Gemini's built-in multimodal capabilities. See the [Image generation guide](/gemini-api/docs/image-generation) for details.

## Generate images using the Imagen models

This example demonstrates generating images with an [Imagen model](https://deepmind.google/technologies/imagen-3/):

### Python

```
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

client = genai.Client()

response = client.models.generate_images(
    model='imagen-4.0-generate-001',
    prompt='Robot holding a red skateboard',
    config=types.GenerateImagesConfig(
        number_of_images= 4,
    )
)
for generated_image in response.generated_images:
  generated_image.image.show()
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: 'Robot holding a red skateboard',
    config: {
      numberOfImages: 4,
    },
  });

  let idx = 1;
  for (const generatedImage of response.generatedImages) {
    let imgBytes = generatedImage.image.imageBytes;
    const buffer = Buffer.from(imgBytes, "base64");
    fs.writeFileSync(`imagen-${idx}.png`, buffer);
    idx++;
  }
}

main();
```

### Go

```
package main

import (
  "context"
  "fmt"
  "os"
  "google.golang.org/genai"
)

func main() {

  ctx := context.Background()
  client, err := genai.NewClient(ctx, nil)
  if err != nil {
      log.Fatal(err)
  }

  config := &genai.GenerateImagesConfig{
      NumberOfImages: 4,
  }

  response, _ := client.Models.GenerateImages(
      ctx,
      "imagen-4.0-generate-001",
      "Robot holding a red skateboard",
      config,
  )

  for n, image := range response.GeneratedImages {
      fname := fmt.Sprintf("imagen-%d.png", n)
          _ = os.WriteFile(fname, image.Image.ImageBytes, 0644)
  }
}
```

### REST

```
curl -X POST \
    "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "instances": [
          {
            "prompt": "Robot holding a red skateboard"
          }
        ],
        "parameters": {
          "sampleCount": 4
        }
      }'
```

![AI-generated image of a robot holding a red skateboard](/static/gemini-api/docs/images/robot-skateboard.png)

AI-generated image of a robot holding a red skateboard

### Imagen configuration

Imagen supports English only prompts at this time and the following parameters:

**Note:** Naming conventions of parameters vary by programming language.

*   `numberOfImages`: The number of images to generate, from 1 to 4 (inclusive). The default is 4.
*   `imageSize`: The size of the generated image. This is only supported for the Standard and Ultra models. The supported values are `1K` and `2K`. Default is `1K`.
*   `aspectRatio`: Changes the aspect ratio of the generated image. Supported values are `"1:1"`, `"3:4"`, `"4:3"`, `"9:16"`, and `"16:9"`. The default is `"1:1"`.
*   `personGeneration`: Allow the model to generate images of people. The following values are supported:
    
    *   `"dont_allow"`: Block generation of images of people.
    *   `"allow_adult"`: Generate images of adults, but not children. This is the default.
    *   `"allow_all"`: Generate images that include adults and children.
    
    **Note:** The `"allow_all"` parameter value is not allowed in EU, UK, CH, MENA locations.
    

## Imagen prompt guide

This section of the Imagen guide shows you how modifying a text-to-image prompt can produce different results, along with examples of images you can create.

### Prompt writing basics

**Note:** Maximum prompt length is 480 tokens.

A good prompt is descriptive and clear, and makes use of meaningful keywords and modifiers. Start by thinking of your **subject**, **context**, and **style**.

![Prompt with subject, context, and style emphasized](/static/gemini-api/docs/images/imagen/style-subject-context.png)

Image text: A *sketch* (**style**) of a *modern apartment building* (**subject**) surrounded by *skyscrapers* (**context and background**).

1.  **Subject**: The first thing to think about with any prompt is the *subject*: the object, person, animal, or scenery you want an image of.
    
2.  **Context and background:** Just as important is the *background or context* in which the subject will be placed. Try placing your subject in a variety of backgrounds. For example, a studio with a white background, outdoors, or indoor environments.
    
3.  **Style:** Finally, add the style of image you want. *Styles* can be general (painting, photograph, sketches) or very specific (pastel painting, charcoal drawing, isometric 3D). You can also combine styles.
    

After you write a first version of your prompt, refine your prompt by adding more details until you get to the image that you want. Iteration is important. Start by establishing your core idea, and then refine and expand upon that core idea until the generated image is close to your vision.

<table><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/0_prompt-writing-basics_park_short.png" alt="photorealistic sample image 1" class="screenshot"><figcaption>Prompt: A park in the spring next to a lake</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/0_prompt-writing-basics_park_medium.png" alt="photorealistic sample image 2" class="screenshot"><figcaption>Prompt: A park in the spring next to a lake, <b>the sun sets across the lake, golden hour</b></figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/0_prompt-writing-basics_park_long.png" alt="photorealistic sample image 3" class="screenshot"><figcaption>Prompt: A park in the spring next to a lake, <i><b>the sun sets across the lake, golden hour, red wildflowers</b></i></figcaption></figure></td></tr></tbody></table>

Imagen models can transform your ideas into detailed images, whether your prompts are short or long and detailed. Refine your vision through iterative prompting, adding details until you achieve the perfect result.

<table class="columns"><tbody><tr><td><div style="text-align: center;"><p>Short prompts let you generate an image quickly.</p><figure><img src="/static/gemini-api/docs/images/imagen/imagen3_short-prompt.png" alt="Imagen 3 short prompt example" class="screenshot"><figcaption>Prompt: close-up photo of a woman in her 20s, street photography, movie still, muted orange warm tones</figcaption></figure></div></td><td><div style="text-align: center;"><p>Longer prompts let you add specific details and build your image.</p><figure><img src="/static/gemini-api/docs/images/imagen/imagen3_long-prompt.png" alt="Imagen 3 long prompt example" class="screenshot"><figcaption>Prompt: captivating photo of a woman in her 20s utilizing a street photography style. The image should look like a movie still with muted orange warm tones.</figcaption></figure></div></td></tr></tbody></table>

Additional advice for Imagen prompt writing:

*   **Use descriptive language**: Employ detailed adjectives and adverbs to paint a clear picture for Imagen.
*   **Provide context**: If necessary, include background information to aid the AI's understanding.
*   **Reference specific artists or styles**: If you have a particular aesthetic in mind, referencing specific artists or art movements can be helpful.
*   **Use prompt engineering tools**: Consider exploring prompt engineering tools or resources to help you refine your prompts and achieve optimal results.
*   **Enhancing the facial details in your personal and group images**: Specify facial details as a focus of the photo (for example, use the word "portrait" in the prompt).

### Generate text in images

Imagen models can add text into images, opening up more creative image generation possibilities. Use the following guidance to get the most out of this feature:

*   **Iterate with confidence**: You might have to regenerate images until you achieve the look you want. Imagen's text integration is still evolving, and sometimes multiple attempts yield the best results.
*   **Keep it short**: Limit text to 25 characters or less for optimal generation.
*   **Multiple phrases**: Experiment with two or three distinct phrases to provide additional information. Avoid exceeding three phrases for cleaner compositions.
    
    ![Imagen 3 generate text example](/static/gemini-api/docs/images/imagen/imagen3_generate-text.png)
    
    Prompt: A poster with the text "Summerland" in bold font as a title, underneath this text is the slogan "Summer never felt so good"
    
*   **Guide Placement**: While Imagen can attempt to position text as directed, expect occasional variations. This feature is continually improving.
    
*   **Inspire font style**: Specify a general font style to subtly influence Imagen's choices. Don't rely on precise font replication, but expect creative interpretations.
    
*   **Font size**: Specify a font size or a general indication of size (for example, *small*, *medium*, *large*) to influence the font size generation.
    

### Prompt parameterization

To better control output results, you might find it helpful to parameterize the inputs into Imagen. For example, suppose you want your customers to be able to generate logos for their business, and you want to make sure logos are always generated on a solid color background. You also want to limit the options that the client can select from a menu.

In this example, you can create a parameterized prompt similar to the following:

```
A {logo_style} logo for a {company_area} company on a solid color background. Include the text {company_name}.
```

In your custom user interface, the customer can input the parameters using a menu, and their chosen value populates the prompt Imagen receives.

For example:

1.  Prompt: `A minimalist logo for a health care company on a solid color background. Include the text Journey.`
    
    ![Imagen 3 prompt parameterization example 1](/static/gemini-api/docs/images/imagen/imagen3_prompt-param_healthcare.png)
    
2.  Prompt: `A modern logo for a software company on a solid color background. Include the text Silo.`
    
    ![Imagen 3 prompt parameterization example 2](/static/gemini-api/docs/images/imagen/imagen3_prompt-param_software.png)
    
3.  Prompt: `A traditional logo for a baking company on a solid color background. Include the text Seed.`
    
    ![Imagen 3 prompt parameterization example 3](/static/gemini-api/docs/images/imagen/imagen3_prompt-param_baking.png)
    

### Advanced prompt writing techniques

Use the following examples to create more specific prompts based on attributes like photography descriptors, shapes and materials, historical art movements, and image quality modifiers.

#### Photography

*   Prompt includes: *"A photo of..."*

To use this style, start with using keywords that clearly tell Imagen that you're looking for a photograph. Start your prompts with *"A photo of. . ."*. For example:

<table><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/1_style-photography_coffee-beans.png" alt="photorealistic sample image 1" class="screenshot"><figcaption>Prompt: <b>A photo of</b> coffee beans in a kitchen on a wooden surface</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/1_style-photography_chocolate-bar.png" alt="photorealistic sample image 2" class="screenshot"><figcaption>Prompt: <b>A photo of</b> a chocolate bar on a kitchen counter</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/1_style-photography_modern-building.png" alt="photorealistic sample image 3" class="screenshot"><figcaption>Prompt: <b>A photo of</b> a modern building with water in the background</figcaption></figure></td></tr></tbody></table>

Image source: Each image was generated using its corresponding text prompt with the Imagen 3 model.

##### Photography modifiers

In the following examples, you can see several photography-specific modifiers and parameters. You can combine multiple modifiers for more precise control.

1.  **Camera Proximity** - *Close up, taken from far away*
    
    <table class="columns"><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/3_camera-proximity_close-up.png" alt="close up camera sample image" class="screenshot"><figcaption>Prompt: A <b>close-up</b> photo of coffee beans</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/3_camera-proximity_zoomed-out.png" alt="zoomed out camera sample image" class="screenshot"><figcaption>Prompt: A <b>zoomed out</b> photo of a small bag of<br>coffee beans in a messy kitchen</figcaption></figure></td></tr></tbody></table>
    
2.  **Camera Position** - *aerial, from below*
    
    <table class="columns"><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/4_camera-position_aerial-photo.png" alt="aerial photo sample image" class="screenshot"><figcaption>Prompt: <b>aerial photo</b> of urban city with skyscrapers</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/4_camera-position_from-below.png" alt="a view from underneath sample image" class="screenshot"><figcaption>Prompt: A photo of a forest canopy with blue skies <b>from below</b></figcaption></figure></td></tr></tbody></table>
    
3.  **Lighting** - *natural, dramatic, warm, cold*
    
    <table class="columns"><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/5_lighting_natural-lighting.png" alt="natural lighting sample image" class="screenshot"><figcaption>Prompt: studio photo of a modern arm chair, <b>natural lighting</b></figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/5_lighting_dramatic-lighting.png" alt="dramatic lighting sample image" class="screenshot"><figcaption>Prompt: studio photo of a modern arm chair, <b>dramatic lighting</b></figcaption></figure></td></tr></tbody></table>
    
4.  **Camera Settings** *\- motion blur, soft focus, bokeh, portrait*
    
    <table class="columns"><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/6_camera-settings_motion-blur.png" alt="motion blur sample image" class="screenshot"><figcaption>Prompt: photo of a city with skyscrapers from the inside of a car with <b>motion blur</b></figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/6_camera-settings_soft-focus.png" alt="soft focus sample image" class="screenshot"><figcaption>Prompt: <b>soft focus</b> photograph of a bridge in an urban city at night</figcaption></figure></td></tr></tbody></table>
    
5.  **Lens types** - *35mm, 50mm, fisheye, wide angle, macro*
    
    <table class="columns"><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/7_lens-types_macro-lens.png" alt="macro lens sample image" class="screenshot"><figcaption>Prompt: photo of a leaf, <b>macro lens</b></figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/7_lens-types_fisheye-lens.png" alt="fisheye lens sample image" class="screenshot"><figcaption>Prompt: street photography, new york city, <b>fisheye lens</b></figcaption></figure></td></tr></tbody></table>
    
6.  **Film types** - *black and white, polaroid*
    
    <table class="columns"><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/8_film-types_polaroid-portrait.png" alt="polaroid photo sample image" class="screenshot"><figcaption>Prompt: a <b>polaroid portrait</b> of a dog wearing sunglasses</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/8_film-types_bw-photo.png" alt="black and white photo sample image" class="screenshot"><figcaption>Prompt: <b>black and white photo</b> of a dog wearing sunglasses</figcaption></figure></td></tr></tbody></table>
    

Image source: Each image was generated using its corresponding text prompt with the Imagen 3 model.

### Illustration and art

*   Prompt includes: *"A painting of..."*, *"A sketch of..."*

Art styles vary from monochrome styles like pencil sketches, to hyper-realistic digital art. For example, the following images use the same prompt with different styles:

*"An \[art style or creation technique\] of an angular sporty electric sedan with skyscrapers in the background"*

<table><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/2_style-illustration1A.png" alt="art sample images" class="screenshot"><figcaption>Prompt: A <b>technical pencil drawing</b> of an angular...</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/2_style-illustration1B.png" alt="art sample images" class="screenshot"><figcaption>Prompt: A <b>charcoal drawing</b> of an angular...</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/2_style-illustration1C.png" alt="art sample images" class="screenshot"><figcaption>Prompt: A <b>color pencil drawing</b> of an angular...</figcaption></figure></td></tr></tbody></table>

<table><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/2_style-illustration2E.png" alt="art sample images" class="screenshot"><figcaption>Prompt: A <b>pastel painting</b> of an angular...</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/2_style-illustration2F.png" alt="art sample images" class="screenshot"><figcaption>Prompt: A <b>digital art</b> of an angular...</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/2_style-illustration2G.png" alt="art sample images" class="screenshot"><figcaption>Prompt: An <b>art deco (poster)</b> of an angular...</figcaption></figure></td></tr></tbody></table>

Image source: Each image was generated using its corresponding text prompt with the Imagen 2 model.

##### Shapes and materials

*   Prompt includes: *"...made of..."*, *"...in the shape of..."*

One of the strengths of this technology is that you can create imagery that is otherwise difficult or impossible. For example, you can recreate your company logo in different materials and textures.

<table><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/9_shapes-materials_duffel.png" alt="shapes and materials example image 1" class="screenshot"><figcaption>Prompt: a duffle bag <b>made of</b> cheese</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/9_shapes-materials_bird.png" alt="shapes and materials example image 2" class="screenshot"><figcaption>Prompt: neon tubes <b>in the shape</b> of a bird</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/9_shapes-materials_paper.png" alt="shapes and materials example image 3" class="screenshot"><figcaption>Prompt: an armchair <b>made of paper</b>, studio photo, origami style</figcaption></figure></td></tr></tbody></table>

Image source: Each image was generated using its corresponding text prompt with the Imagen 3 model.

#### Historical art references

*   Prompt includes: *"...in the style of..."*

Certain styles have become iconic over the years. The following are some ideas of historical painting or art styles that you can try.

*"generate an image in the style of \[art period or movement\] : a wind farm"*

<table><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/10_historical-ref1_impressionism.png" alt="impressionism example image" class="screenshot"><figcaption>Prompt: generate an image <b>in the style of <i>an impressionist painting</i></b>: a wind farm</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/10_historical-ref1_renaissance.png" alt="renaissance example image" class="screenshot"><figcaption>Prompt: generate an image <b>in the style of <i>a renaissance painting</i></b>: a wind farm</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/10_historical-ref1_pop-art.png" alt="pop art example image" class="screenshot"><figcaption>Prompt: generate an image <b>in the style of <i>pop art</i></b>: a wind farm</figcaption></figure></td></tr></tbody></table>

Image source: Each image was generated using its corresponding text prompt with the Imagen 3 model.

#### Image quality modifiers

Certain keywords can let the model know that you're looking for a high-quality asset. Examples of quality modifiers include the following:

*   **General Modifiers** - *high-quality, beautiful, stylized*
*   **Photos** - *4K, HDR, Studio Photo*
*   **Art, Illustration** - *by a professional, detailed*

The following are a few examples of prompts without quality modifiers and the same prompt with quality modifiers.

<table><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/11_quality-modifier2_no-mods.png" alt="corn example image without modifiers" class="screenshot"><figcaption>Prompt (no quality modifiers): a photo of a corn stalk</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/11_quality-modifier2_4k-hdr.png" alt="corn example image with modifiers" class="screenshot"><figcaption>Prompt (with quality modifiers): <b>4k HDR beautiful</b><br>photo of a corn stalk <b>taken by a<br>professional photographer</b></figcaption></figure></td></tr></tbody></table>

Image source: Each image was generated using its corresponding text prompt with the Imagen 3 model.

#### Aspect ratios

Imagen image generation lets you set five distinct image aspect ratios.

1.  **Square** (1:1, default) - A standard square photo. Common uses for this aspect ratio include social media posts.
2.  **Fullscreen** (4:3) - This aspect ratio is commonly used in media or film. It is also the dimensions of most old (non-widescreen) TVs and medium format cameras. It captures more of the scene horizontally (compared to 1:1), making it a preferred aspect ratio for photography.
    
    <table class="columns"><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/aspect-ratios_4-3_piano.png" alt="aspect ratio example" class="screenshot"><figcaption>Prompt: close up of a musician's fingers playing the piano, black and white film, vintage (4:3 aspect ratio)</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/aspect-ratios_4-3_fries.png" alt="aspect ratio example" class="screenshot"><figcaption>Prompt: A professional studio photo of french fries for a high end restaurant, in the style of a food magazine (4:3 aspect ratio)</figcaption></figure></td></tr></tbody></table>
    
3.  **Portrait full screen** (3:4) - This is the fullscreen aspect ratio rotated 90 degrees. This lets to capture more of the scene vertically compared to the 1:1 aspect ratio.
    
    <table class="columns"><tbody><tr><td><figure><img src="/static/gemini-api/docs/images/imagen/aspect-ratios_3-4_hiking.png" alt="aspect ratio example" class="screenshot"><figcaption>Prompt: a woman hiking, close of her boots reflected in a puddle, large mountains in the background, in the style of an advertisement, dramatic angles (3:4 aspect ratio)</figcaption></figure></td><td><figure><img src="/static/gemini-api/docs/images/imagen/aspect-ratios_3-4_valley.png" alt="aspect ratio example" class="screenshot"><figcaption>Prompt: aerial shot of a river flowing up a mystical valley (3:4 aspect ratio)</figcaption></figure></td></tr></tbody></table>
    
4.  **Widescreen** (16:9) - This ratio has replaced 4:3 and is now the most common aspect ratio for TVs, monitors, and mobile phone screens (landscape). Use this aspect ratio when you want to capture more of the background (for example, scenic landscapes).
    
    ![aspect ratio example](/static/gemini-api/docs/images/imagen/aspect-ratios_16-9_man.png)
    
    Prompt: a man wearing all white clothing sitting on the beach, close up, golden hour lighting (16:9 aspect ratio)
    
5.  **Portrait** (9:16) - This ratio is widescreen but rotated. This a relatively new aspect ratio that has been popularized by short form video apps (for example, YouTube shorts). Use this for tall objects with strong vertical orientations such as buildings, trees, waterfalls, or other similar objects.
    
    ![aspect ratio example](/static/gemini-api/docs/images/imagen/aspect-ratios_9-16_skyscraper.png)
    
    Prompt: a digital render of a massive skyscraper, modern, grand, epic with a beautiful sunset in the background (9:16 aspect ratio)
    

#### Photorealistic images

Different versions of the image generation model might offer a mix of artistic and photorealistic output. Use the following wording in prompts to generate more photorealistic output, based on the subject you want to generate.

**Note:** Take these keywords as general guidance when you try to create photorealistic images. They aren't required to achieve your goal.

| Use case | Lens type | Focal lengths | Additional details |
| --- | --- | --- | --- |
| People (portraits) | Prime, zoom | 24-35mm | black and white film, Film noir, Depth of field, duotone (mention two colors) |
| Food, insects, plants (objects, still life) | Macro | 60-105mm | High detail, precise focusing, controlled lighting |
| Sports, wildlife (motion) | Telephoto zoom | 100-400mm | Fast shutter speed, Action or movement tracking |
| Astronomical, landscape (wide-angle) | Wide-angle | 10-24mm | Long exposure times, sharp focus, long exposure, smooth water or clouds |

##### Portraits

| Use case | Lens type | Focal lengths | Additional details |
| --- | --- | --- | --- |
| People (portraits) | Prime, zoom | 24-35mm | black and white film, Film noir, Depth of field, duotone (mention two colors) |

Using several keywords from the table, Imagen can generate the following portraits:

<table><tbody><tr><td><img src="/static/gemini-api/docs/images/imagen/portrait_blue-gray1.png" alt="portrait photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/portrait_blue-gray2.png" alt="portrait photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/portrait_blue-gray3.png" alt="portrait photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/portrait_blue-gray4.png" alt="portrait photography example" class="screenshot"></td></tr></tbody></table>

Prompt: *A woman, 35mm portrait, blue and grey duotones*  
Model: `imagen-3.0-generate-002`

<table><tbody><tr><td><img src="/static/gemini-api/docs/images/imagen/portrait_film-noir1.png" alt="portrait photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/portrait_film-noir2.png" alt="portrait photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/portrait_film-noir3.png" alt="portrait photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/portrait_film-noir4.png" alt="portrait photography example" class="screenshot"></td></tr></tbody></table>

Prompt: *A woman, 35mm portrait, film noir*  
Model: `imagen-3.0-generate-002`

##### Objects

| Use case | Lens type | Focal lengths | Additional details |
| --- | --- | --- | --- |
| Food, insects, plants (objects, still life) | Macro | 60-105mm | High detail, precise focusing, controlled lighting |

Using several keywords from the table, Imagen can generate the following object images:

<table><tbody><tr><td><img src="/static/gemini-api/docs/images/imagen/object_leaf1.png" alt="object photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/object_leaf2.png" alt="object photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/object_leaf3.png" alt="object photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/object_leaf4.png" alt="object photography example" class="screenshot"></td></tr></tbody></table>

Prompt: *leaf of a prayer plant, macro lens, 60mm*  
Model: `imagen-3.0-generate-002`

<table><tbody><tr><td><img src="/static/gemini-api/docs/images/imagen/object_pasta1.png" alt="object photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/object_pasta2.png" alt="object photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/object_pasta3.png" alt="object photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/object_pasta4.png" alt="object photography example" class="screenshot"></td></tr></tbody></table>

Prompt: *a plate of pasta, 100mm Macro lens*  
Model: `imagen-3.0-generate-002`

##### Motion

| Use case | Lens type | Focal lengths | Additional details |
| --- | --- | --- | --- |
| Sports, wildlife (motion) | Telephoto zoom | 100-400mm | Fast shutter speed, Action or movement tracking |

Using several keywords from the table, Imagen can generate the following motion images:

<table><tbody><tr><td><img src="/static/gemini-api/docs/images/imagen/motion_football1.png" alt="motion photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/motion_football2.png" alt="motion photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/motion_football3.png" alt="motion photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/motion_football4.png" alt="motion photography example" class="screenshot"></td></tr></tbody></table>

Prompt: *a winning touchdown, fast shutter speed, movement tracking*  
Model: `imagen-3.0-generate-002`

<table><tbody><tr><td><img src="/static/gemini-api/docs/images/imagen/motion_deer1.png" alt="motion photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/motion_deer2.png" alt="motion photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/motion_deer3.png" alt="motion photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/motion_deer4.png" alt="motion photography example" class="screenshot"></td></tr></tbody></table>

Prompt: *A deer running in the forest, fast shutter speed, movement tracking*  
Model: `imagen-3.0-generate-002`

##### Wide-angle

| Use case | Lens type | Focal lengths | Additional details |
| --- | --- | --- | --- |
| Astronomical, landscape (wide-angle) | Wide-angle | 10-24mm | Long exposure times, sharp focus, long exposure, smooth water or clouds |

Using several keywords from the table, Imagen can generate the following wide-angle images:

<table><tbody><tr><td><img src="/static/gemini-api/docs/images/imagen/wide-angle_mountain1.png" alt="wide-angle photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/wide-angle_mountain2.png" alt="wide-angle photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/wide-angle_mountain3.png" alt="wide-angle photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/wide-angle_mountain4.png" alt="wide-angle photography example" class="screenshot"></td></tr></tbody></table>

Prompt: *an expansive mountain range, landscape wide angle 10mm*  
Model: `imagen-3.0-generate-002`

<table><tbody><tr><td><img src="/static/gemini-api/docs/images/imagen/wide-angle_astro1.png" alt="wide-angle photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/wide-angle_astro2.png" alt="wide-angle photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/wide-angle_astro3.png" alt="wide-angle photography example" class="screenshot"></td><td><img src="/static/gemini-api/docs/images/imagen/wide-angle_astro4.png" alt="wide-angle photography example" class="screenshot"></td></tr></tbody></table>

Prompt: *a photo of the moon, astro photography, wide angle 10mm*  
Model: `imagen-3.0-generate-002`

## Model versions

### Imagen 4

| Property | Description |
| --- | --- |
| id\_cardModel code | 
**Gemini API**

`imagen-4.0-generate-001`  
`imagen-4.0-ultra-generate-001`  
`imagen-4.0-fast-generate-001`



 |
| saveSupported data types | 

**Input**

Text

**Output**

Images



 |
| token\_autoToken limits[\[\*\]](/gemini-api/docs/tokens) | 

**Input token limit**

480 tokens (text)

**Output images**

1 to 4 (Ultra/Standard/Fast)



 |
| calendar\_monthLatest update | June 2025 |

### Imagen 3

| Property | Description |
| --- | --- |
| id\_cardModel code | 
**Gemini API**

`imagen-3.0-generate-002`



 |
| saveSupported data types | 

**Input**

Text

**Output**

Images



 |
| token\_autoToken limits[\[\*\]](/gemini-api/docs/tokens) | 

**Input token limit**

N/A

**Output images**

Up to 4



 |
| calendar\_monthLatest update | February 2025 |

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-11-03 UTC.
