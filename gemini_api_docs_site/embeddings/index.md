# Embeddings  |  Gemini API  |  Google AI for Developers

Source: https://ai.google.dev/gemini-api/docs/embeddings

/\* Styles inlined from /site-assets/css/models.css \*/ :root { --gemini-api-table-font-color: #3c4043; --gemini-api-model-font: 'Google Sans Text', Roboto, sans-serif; --gemini-api-card-width: 17rem; --gemini-api-elevation-1dp: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2); --gemini-api-elevation-3dp: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12), 0 1px 8px 0 rgba(0, 0, 0, 0.2); } body\[theme="googledevai-theme"\] { --googledevai-button-gradient: var(--googledevai-button-gradient-light); } body\[theme="googledevai-theme"\].color-scheme--dark { --googledevai-button-gradient: var(--googledevai-button-gradient-dark); } .google-symbols { background: -webkit-linear-gradient(45deg, var(--googledevai-blue), var(--googledevai-purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; user-select: none; vertical-align: bottom; } /\* Cards \*/ @media only screen and (min-width: 625px) { .gemini-api-recommended { display: grid; grid-template-columns: repeat(3, 1fr); /\* Three equal-width columns \*/ grid-column-gap: 3rem; /\* Keep the gap between columns \*/ } } .gemini-api-recommended { width: 100%; /\* Take full width of parent \*/ margin: 0 auto; } .gemini-api-card { background: var(--devsite-background-1); border: 1px solid var(--googledevai-border-color); border-radius: 9px; box-shadow: var(--gemini-api-elevation-1dp); height: 23rem; margin: 1rem .5rem; padding: 1rem; transition: box-shadow 0.3s ease-in-out; width: var(--gemini-api-card-width); } .color-scheme--dark .gemini-api-card { background: #131314; border-color: #444746; } .gemini-api-card:hover { box-shadow: var(--gemini-api-elevation-3dp); } .gemini-api-card a:empty { display: block; position: relative; height: 23rem; width: var(--gemini-api-card-width); top: -22.8rem; left: -1rem; } .gemini-api-card a:empty:focus { border: 2px solid var(--devsite-primary-color); border-radius: 9px; } .gemini-api-card-title { font-family: "Google Sans", Roboto, sans-serif; font-size: 1.3rem; font-weight: 500; height: 1.5rem; margin-bottom: 2.5rem; line-height: 1.3rem; } .gemini-api-card-description { font-size: .9rem; height: 7.5rem; overflow: hidden; text-overflow: ellipsis; white-space: normal; } .gemini-api-card-bulletpoints { color: #757575; font-size: .8rem; height: 8.2rem; margin-left: 1rem; padding: 0; } .color-scheme--dark .gemini-api-card-bulletpoints { color: var(--devsite-primary-text-color); } .gemini-api-card-description, .gemini-api-card-bulletpoints { font-family: var(--gemini-api-model-font); } .gemini-api-card-bulletpoints li { line-height: 1rem; margin: .3rem 0; } /\* Tables \*/ .gemini-api-model-table, .gemini-api-model-table th { color: var(--gemini-api-table-font-color); font: .95rem var(--gemini-api-model-font); } .color-scheme--dark .gemini-api-model-table, .color-scheme--dark .gemini-api-model-table th { color: var(--devsite-primary-text-color); } .gemini-api-model-table th { font-weight: 500; } .gemini-api-model-table td:first-child { max-width: 0; } .gemini-api-model-table-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); grid-gap: 1rem .5rem; } .gemini-api-model-table section { display: inline-grid; } .gemini-api-model-table p { margin: 0 0 .5rem; } .gemini-api-model-table li { margin: 0; } .gemini-api-model-table ul { margin-top: .5rem; } .gemini-api-model-table .google-symbols { margin-right: .7rem; vertical-align: middle; } .gemini-api-supported, .gemini-api-not-supported, .gemini-api-experimental { border-radius: 8px; display: inline-block; font-size: .9rem; font-weight: 500; line-height: 1rem; padding: .3rem 0.5em; } .gemini-api-supported { background: #e6f4ea; /\* GM3 Green 50 \*/ color: #177d37; /\* GM3 Green 700 \*/ } .gemini-api-not-supported { background: #fce8e6; /\* GM3 Red 50 \*/ color: #c5221f; /\* GM3 Red 700 \*/ } .gemini-api-experimental { background: #e8def8; color: #4a4458; } .color-scheme--dark .gemini-api-supported { background: #177d37; /\* GM3 Green 700 \*/ color: #e6f4ea; /\* GM3 Green 50 \*/ } .color-scheme--dark .gemini-api-not-supported { background: #c5221f; /\* GM3 Red 700 \*/ color: #fce8e6; /\* GM3 Red 50 \*/ } /\* Buttons \*/ .gemini-api-model-button { background: var(--googledevai-button-gradient); background-size: 300% 300%; border-radius: 20rem; color: #001d35; font-family: var(--gemini-api-model-font); font-size: .9rem; font-weight: 500; padding: .6rem 1rem; text-align: center; text-decoration: none; transition: filter .2s ease-in-out, box-shadow .2s ease-in-out; } .gemini-api-model-button:hover{ animation: gradient 5s ease infinite; filter: brightness(.98); box-shadow: var(--gemini-api-elevation-1dp); } .gemini-api-model-button:focus { filter: brightness(.95); outline: #00639b solid 3px; outline-offset: 2px; text-decoration: none; } .gemini-api-model-button::before { content: 'spark'; font-family: 'Google Symbols'; padding-right: 0.5rem; vertical-align: middle; } @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } } .model-card { display: flex; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); transition: box-shadow 0.3s ease; } .color-scheme--dark .model-card { background-color: #3c4043; } .model-card:hover { box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); } .card-content { padding: 2.5rem; flex: 1; } .sub-heading-model { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 0.5rem 0; } .color-scheme--dark .sub-heading-model { color: var(--devsite-primary-text-color); } .card-content h2 { font-size: 2rem; font-weight: 500; margin: 0 0 1rem 0; } .description { font-size: 1rem; line-height: 1.6; color: #3c4043; margin: 0 0 1.5rem 0; } .color-scheme--dark .description { color: var(--devsite-primary-text-color); } .card-content a:not(.gemini-api-model-button) { color: #1a73e8; text-decoration: none; font-weight: 600; } .card-content a:hover { text-decoration: underline; } @media (max-width: 768px) { .model-card { flex-direction: column; } .card-content { padding: 1.5rem; } h1 { font-size: 2rem; } .card-content h2 { font-size: 1.5rem; } }

Gemini 3 Pro is here. [Try it for free in Google AI Studio](https://aistudio.google.com?model=gemini-3-pro-preview).

*   [Home](https://ai.google.dev/)
*   [Gemini API](https://ai.google.dev/gemini-api)
*   [Gemini API Docs](https://ai.google.dev/gemini-api/docs)

Send feedback

# Embeddings

The Gemini API offers text embedding models to generate embeddings for words, phrases, sentences, and code. These foundational embeddings power advanced NLP tasks such as semantic search, classification, and clustering, providing more accurate, context-aware results than keyword-based approaches.

Building Retrieval Augmented Generation (RAG) systems is a common use case for embeddings. Embeddings play a key role in significantly enhancing model outputs with improved factual accuracy, coherence, and contextual richness. They efficiently retrieve relevant information from knowledge bases, represented by embeddings, which are then passed as additional context in the input prompt to language models, guiding it to generate more informed and accurate responses.

To learn more about the available embedding model variants, see the [Model versions](#model-versions) section. For higher throughput serving at half the price, try [Batch API Embedding](#batch-embedding).

## Generating embeddings

Use the `embedContent` method to generate text embeddings:

### Python

```
from google import genai

client = genai.Client()

result = client.models.embed_content(
        model="gemini-embedding-001",
        contents="What is the meaning of life?")

print(result.embeddings)
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

async function main() {

    const ai = new GoogleGenAI({});

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: 'What is the meaning of life?',
    });

    console.log(response.embeddings);
}

main();
```

### Go

```
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"

    "google.golang.org/genai"
)

func main() {
    ctx := context.Background()
    client, err := genai.NewClient(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }

    contents := []*genai.Content{
        genai.NewContentFromText("What is the meaning of life?", genai.RoleUser),
    }
    result, err := client.Models.EmbedContent(ctx,
        "gemini-embedding-001",
        contents,
        nil,
    )
    if err != nil {
        log.Fatal(err)
    }

    embeddings, err := json.MarshalIndent(result.Embeddings, "", "  ")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(string(embeddings))
}
```

### REST

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent" \
-H "x-goog-api-key: $GEMINI_API_KEY" \
-H 'Content-Type: application/json' \
-d '{"model": "models/gemini-embedding-001",
     "content": {"parts":[{"text": "What is the meaning of life?"}]}
    }'
```

You can also generate embeddings for multiple chunks at once by passing them in as a list of strings.

### Python

```
from google import genai

client = genai.Client()

result = client.models.embed_content(
        model="gemini-embedding-001",
        contents= [
            "What is the meaning of life?",
            "What is the purpose of existence?",
            "How do I bake a cake?"
        ])

for embedding in result.embeddings:
    print(embedding)
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

async function main() {

    const ai = new GoogleGenAI({});

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: [
            'What is the meaning of life?',
            'What is the purpose of existence?',
            'How do I bake a cake?'
        ],
    });

    console.log(response.embeddings);
}

main();
```

### Go

```
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"

    "google.golang.org/genai"
)

func main() {
    ctx := context.Background()
    client, err := genai.NewClient(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }

    contents := []*genai.Content{
        genai.NewContentFromText("What is the meaning of life?"),
        genai.NewContentFromText("How does photosynthesis work?"),
        genai.NewContentFromText("Tell me about the history of the internet."),
    }
    result, err := client.Models.EmbedContent(ctx,
        "gemini-embedding-001",
        contents,
        nil,
    )
    if err != nil {
        log.Fatal(err)
    }

    embeddings, err := json.MarshalIndent(result.Embeddings, "", "  ")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(string(embeddings))
}
```

### REST

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents" \
-H "x-goog-api-key: $GEMINI_API_KEY" \
-H 'Content-Type: application/json' \
-d '{"requests": [{
    "model": "models/gemini-embedding-001",
    "content": {
    "parts":[{
        "text": "What is the meaning of life?"}]}, },
    {
    "model": "models/gemini-embedding-001",
    "content": {
    "parts":[{
        "text": "How much wood would a woodchuck chuck?"}]}, },
    {
    "model": "models/gemini-embedding-001",
    "content": {
    "parts":[{
        "text": "How does the brain work?"}]}, }, ]}' 2> /dev/null | grep -C 5 values
    ```
```

## Specify task type to improve performance

You can use embeddings for a wide range of tasks from classification to document search. Specifying the right task type helps optimize the embeddings for the intended relationships, maximizing accuracy and efficiency. For a complete list of supported task types, see the [Supported task types](#supported-task-types) table.

The following example shows how you can use `SEMANTIC_SIMILARITY` to check how similar in meaning strings of texts are.

**Note:** Cosine similarity is a good distance metric because it focuses on direction rather than magnitude, which more accurately reflects conceptual closeness. Values range from -1 (opposite) to 1 (greatest similarity).

### Python

```
from google import genai
from google.genai import types
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

client = genai.Client()

texts = [
    "What is the meaning of life?",
    "What is the purpose of existence?",
    "How do I bake a cake?"]

result = [
    np.array(e.values) for e in client.models.embed_content(
        model="gemini-embedding-001",
        contents=texts,
        config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY")).embeddings
]

# Calculate cosine similarity. Higher scores = greater semantic similarity.

embeddings_matrix = np.array(result)
similarity_matrix = cosine_similarity(embeddings_matrix)

for i, text1 in enumerate(texts):
    for j in range(i + 1, len(texts)):
        text2 = texts[j]
        similarity = similarity_matrix[i, j]
        print(f"Similarity between '{text1}' and '{text2}': {similarity:.4f}")
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";
import * as cosineSimilarity from "compute-cosine-similarity";

async function main() {
    const ai = new GoogleGenAI({});

    const texts = [
        "What is the meaning of life?",
        "What is the purpose of existence?",
        "How do I bake a cake?",
    ];

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: texts,
        taskType: 'SEMANTIC_SIMILARITY'
    });

    const embeddings = response.embeddings.map(e => e.values);

    for (let i = 0; i < texts.length; i++) {
        for (let j = i + 1; j < texts.length; j++) {
            const text1 = texts[i];
            const text2 = texts[j];
            const similarity = cosineSimilarity(embeddings[i], embeddings[j]);
            console.log(`Similarity between '${text1}' and '${text2}': ${similarity.toFixed(4)}`);
        }
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
    "log"
    "math"

    "google.golang.org/genai"
)

// cosineSimilarity calculates the similarity between two vectors.
func cosineSimilarity(a, b []float32) (float64, error) {
    if len(a) != len(b) {
        return 0, fmt.Errorf("vectors must have the same length")
    }

    var dotProduct, aMagnitude, bMagnitude float64
    for i := 0; i < len(a); i++ {
        dotProduct += float64(a[i] * b[i])
        aMagnitude += float64(a[i] * a[i])
        bMagnitude += float64(b[i] * b[i])
    }

    if aMagnitude == 0 || bMagnitude == 0 {
        return 0, nil
    }

    return dotProduct / (math.Sqrt(aMagnitude) * math.Sqrt(bMagnitude)), nil
}

func main() {
    ctx := context.Background()
    client, _ := genai.NewClient(ctx, nil)
    defer client.Close()

    texts := []string{
        "What is the meaning of life?",
        "What is the purpose of existence?",
        "How do I bake a cake?",
    }

    var contents []*genai.Content
    for _, text := range texts {
        contents = append(contents, genai.NewContentFromText(text, genai.RoleUser))
    }

    result, _ := client.Models.EmbedContent(ctx,
        "gemini-embedding-001",
        contents,
        &genai.EmbedContentRequest{TaskType: genai.TaskTypeSemanticSimilarity},
    )

    embeddings := result.Embeddings

    for i := 0; i < len(texts); i++ {
        for j := i + 1; j < len(texts); j++ {
            similarity, _ := cosineSimilarity(embeddings[i].Values, embeddings[j].Values)
            fmt.Printf("Similarity between '%s' and '%s': %.4f\n", texts[i], texts[j], similarity)
        }
    }
}
```

### REST

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent" \
-H "x-goog-api-key: $GEMINI_API_KEY" \
-H 'Content-Type: application/json' \
-d '{"task_type": "SEMANTIC_SIMILARITY",
    "content": {
    "parts":[{
    "text": "What is the meaning of life?"}, {"text": "How much wood would a woodchuck chuck?"}, {"text": "How does the brain work?"}]}
    }'
```

The following shows an example output from this code snippet:

```
Similarity between 'What is the meaning of life?' and 'What is the purpose of existence?': 0.9481

Similarity between 'What is the meaning of life?' and 'How do I bake a cake?': 0.7471

Similarity between 'What is the purpose of existence?' and 'How do I bake a cake?': 0.7371
```

### Supported task types

| Task type | Description | Examples |
| --- | --- | --- |
| **SEMANTIC\_SIMILARITY** | Embeddings optimized to assess text similarity. | Recommendation systems, duplicate detection |
| **CLASSIFICATION** | Embeddings optimized to classify texts according to preset labels. | Sentiment analysis, spam detection |
| **CLUSTERING** | Embeddings optimized to cluster texts based on their similarities. | Document organization, market research, anomaly detection |
| **RETRIEVAL\_DOCUMENT** | Embeddings optimized for document search. | Indexing articles, books, or web pages for search. |
| **RETRIEVAL\_QUERY** | Embeddings optimized for general search queries. Use `RETRIEVAL_QUERY` for queries; `RETRIEVAL_DOCUMENT` for documents to be retrieved. | Custom search |
| **CODE\_RETRIEVAL\_QUERY** | Embeddings optimized for retrieval of code blocks based on natural language queries. Use `CODE_RETRIEVAL_QUERY` for queries; `RETRIEVAL_DOCUMENT` for code blocks to be retrieved. | Code suggestions and search |
| **QUESTION\_ANSWERING** | Embeddings for questions in a question-answering system, optimized for finding documents that answer the question. Use `QUESTION_ANSWERING` for questions; `RETRIEVAL_DOCUMENT` for documents to be retrieved. | Chatbox |
| **FACT\_VERIFICATION** | Embeddings for statements that need to be verified, optimized for retrieving documents that contain evidence supporting or refuting the statement. Use `FACT_VERIFICATION` for the target text; `RETRIEVAL_DOCUMENT` for documents to be retrieved | Automated fact-checking systems |

## Controlling embedding size

The Gemini embedding model, `gemini-embedding-001`, is trained using the Matryoshka Representation Learning (MRL) technique which teaches a model to learn high-dimensional embeddings that have initial segments (or prefixes) which are also useful, simpler versions of the same data.

Use the `output_dimensionality` parameter to control the size of the output embedding vector. Selecting a smaller output dimensionality can save storage space and increase computational efficiency for downstream applications, while sacrificing little in terms of quality. By default, it outputs a 3072-dimensional embedding, but you can truncate it to a smaller size without losing quality to save storage space. We recommend using 768, 1536, or 3072 output dimensions.

### Python

```
from google import genai
from google.genai import types

client = genai.Client()

result = client.models.embed_content(
    model="gemini-embedding-001",
    contents="What is the meaning of life?",
    config=types.EmbedContentConfig(output_dimensionality=768)
)

[embedding_obj] = result.embeddings
embedding_length = len(embedding_obj.values)

print(f"Length of embedding: {embedding_length}")
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

async function main() {
    const ai = new GoogleGenAI({});

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        content: 'What is the meaning of life?',
        outputDimensionality: 768,
    });

    const embeddingLength = response.embedding.values.length;
    console.log(`Length of embedding: ${embeddingLength}`);
}

main();
```

### Go

```
package main

import (
    "context"
    "fmt"
    "log"

    "google.golang.org/genai"
)

func main() {
    ctx := context.Background()
    // The client uses Application Default Credentials.
    // Authenticate with 'gcloud auth application-default login'.
    client, err := genai.NewClient(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }
    defer client.Close()

    contents := []*genai.Content{
        genai.NewContentFromText("What is the meaning of life?", genai.RoleUser),
    }

    result, err := client.Models.EmbedContent(ctx,
        "gemini-embedding-001",
        contents,
        &genai.EmbedContentRequest{OutputDimensionality: 768},
    )
    if err != nil {
        log.Fatal(err)
    }

    embedding := result.Embeddings[0]
    embeddingLength := len(embedding.Values)
    fmt.Printf("Length of embedding: %d\n", embeddingLength)
}
```

### REST

```
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent" \
    -H "x-goog-api-key: $GEMINI_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
        "content": {"parts":[{ "text": "What is the meaning of life?"}]},
        "output_dimensionality": 768
    }'
```

Example output from the code snippet:

```
Length of embedding: 768
```

## Ensuring quality for smaller dimensions

The 3072 dimension embedding is normalized. Normalized embeddings produce more accurate semantic similarity by comparing vector direction, not magnitude. For other dimensions, including 768 and 1536, you need to normalize the embeddings as follows:

### Python

```
import numpy as np
from numpy.linalg import norm

embedding_values_np = np.array(embedding_obj.values)
normed_embedding = embedding_values_np / np.linalg.norm(embedding_values_np)

print(f"Normed embedding length: {len(normed_embedding)}")
print(f"Norm of normed embedding: {np.linalg.norm(normed_embedding):.6f}") # Should be very close to 1
```

Example output from this code snippet:

```
Normed embedding length: 768
Norm of normed embedding: 1.000000
```

The following table shows the MTEB scores, a commonly used benchmark for embeddings, for different dimensions. Notably, the result shows that performance is not strictly tied to the size of the embedding dimension, with lower dimensions achieving scores comparable to their higher dimension counterparts.

| MRL Dimension | MTEB Score |
| --- | --- |
| 2048 | 68.16 |
| 1536 | 68.17 |
| 768 | 67.99 |
| 512 | 67.55 |
| 256 | 66.19 |
| 128 | 63.31 |

## Use cases

Text embeddings are crucial for a variety of common AI use cases, such as:

*   **Retrieval-Augmented Generation (RAG):** Embeddings enhance the quality of generated text by retrieving and incorporating relevant information into the context of a model.
*   **Information retrieval:** Search for the most semantically similar text or documents given a piece of input text.
    
    [Document search tutorialtask](https://github.com/google-gemini/cookbook/blob/main/examples/Talk_to_documents_with_embeddings.ipynb)
    
*   **Search reranking**: Prioritize the most relevant items by semantically scoring initial results against the query.
    
    [Search reranking tutorialtask](https://github.com/google-gemini/cookbook/blob/main/examples/Search_reranking_using_embeddings.ipynb)
    
*   **Anomaly detection:** Comparing groups of embeddings can help identify hidden trends or outliers.
    
    [Anomaly detection tutorialbubble\_chart](https://github.com/google-gemini/cookbook/blob/main/examples/Anomaly_detection_with_embeddings.ipynb)
    
*   **Classification:** Automatically categorize text based on its content, such as sentiment analysis or spam detection
    
    [Classification tutorialtoken](https://github.com/google-gemini/cookbook/blob/main/examples/Classify_text_with_embeddings.ipynb)
    
*   **Clustering:** Effectively grasp complex relationships by creating clusters and visualizations of your embeddings.
    
    [Clustering visualization tutorialbubble\_chart](https://github.com/google-gemini/cookbook/blob/main/examples/clustering_with_embeddings.ipynb)
    

## Storing embeddings

As you take embeddings to production, it is common to use **vector databases** to efficiently store, index, and retrieve high-dimensional embeddings. Google Cloud offers managed data services that can be used for this purpose including [BigQuery](https://cloud.google.com/bigquery/docs/introduction), [AlloyDB](https://cloud.google.com/alloydb/docs/overview), and [Cloud SQL](https://cloud.google.com/sql/docs/postgres/introduction).

The following tutorials show how to use other third party vector databases with Gemini Embedding.

*   [ChromaDB tutorialsbolt](https://github.com/google-gemini/cookbook/tree/main/examples/chromadb)
*   [QDrant tutorialsbolt](https://github.com/google-gemini/cookbook/tree/main/examples/qdrant)
*   [Weaviate tutorialsbolt](https://github.com/google-gemini/cookbook/tree/main/examples/weaviate)
*   [Pinecone tutorialsbolt](https://github.com/google-gemini/cookbook/blob/main/examples/langchain/Gemini_LangChain_QA_Pinecone_WebLoad.ipynb)

## Model versions

| Property | Description |
| --- | --- |
| id\_cardModel code | 
**Gemini API**

`gemini-embedding-001`



 |
| saveSupported data types | 

**Input**

Text

**Output**

Text embeddings



 |
| token\_autoToken limits[\[\*\]](/gemini-api/docs/tokens) | 

**Input token limit**

2,048

**Output dimension size**

Flexible, supports: 128 - 3072, Recommended: 768, 1536, 3072



 |
| 123Versions | 

Read the [model version patterns](/gemini-api/docs/models/gemini#model-versions) for more details.

*   Stable: `gemini-embedding-001`
*   Experimental: `gemini-embedding-exp-03-07` (deprecating in Oct of 2025)



 |
| calendar\_monthLatest update | June 2025 |

## Batch embeddings

If latency is not a concern, try using the Gemini Embeddings model with [Batch API](/gemini-api/docs/batch-api#batch-embedding). This allows for much higher throughput at 50% of interactive Embedding pricing. Find examples on how to get started in the [Batch API cookbook](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Batch_mode.ipynb).

## Responsible use notice

Unlike generative AI models that create new content, the Gemini Embedding model is only intended to transform the format of your input data into a numerical representation. While Google is responsible for providing an embedding model that transforms the format of your input data to the numerical-format requested, users retain full responsibility for the data they input and the resulting embeddings. By using the Gemini Embedding model you confirm that you have the necessary rights to any content that you upload. Do not generate content that infringes on others' intellectual property or privacy rights. Your use of this service is subject to our [Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy) and [Google's Terms of Service](/gemini-api/terms).

## Start building with embeddings

Check out the [embeddings quickstart notebook](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Embeddings.ipynb) to explore the model capabilities and learn how to customize and visualize your embeddings.

## Deprecation notice for legacy models

The following models will be deprecated in October, 2025: - `embedding-001` - `embedding-gecko-001` - `gemini-embedding-exp-03-07` (`gemini-embedding-exp`)

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-10-24 UTC.
