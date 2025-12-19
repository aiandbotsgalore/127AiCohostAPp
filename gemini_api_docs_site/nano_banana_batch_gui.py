"""
Nano Banana Pro (gemini-3-pro-image-preview) batch image generator.
- Uses google-genai with the model from ai.google.dev image generation docs.
- Enter multiple prompts (one per line), pick aspect ratio and resolution, and save outputs.
- API key is read from GEMINI_API_KEY/GOOGLE_API_KEY if left blank.
"""

import os
import re
import threading
import tkinter as tk
from tkinter import filedialog, messagebox, ttk

from google import genai
from google.genai import types


MODEL_ID = "gemini-3-pro-image-preview"  # Nano Banana Pro Preview
ASPECT_RATIOS = [
    "1:1",
    "2:3",
    "3:2",
    "3:4",
    "4:3",
    "4:5",
    "5:4",
    "9:16",
    "16:9",
    "21:9",
]
RESOLUTIONS = ["1K", "2K", "4K"]


class NanoBananaGUI:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("Nano Banana Pro Batch Generator")
        self.root.geometry("760x620")
        self.running = False

        self.api_key_var = tk.StringVar(
            value=os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY", "")
        )
        self.aspect_var = tk.StringVar(value="1:1")
        self.resolution_var = tk.StringVar(value="1K")
        default_out = os.path.join(os.getcwd(), "nano_banana_outputs")
        self.output_dir_var = tk.StringVar(value=default_out)

        self._build_layout()

    def _build_layout(self) -> None:
        padding = {"padx": 8, "pady": 6}

        header = ttk.Label(
            self.root,
            text="Batch image generation via gemini-3-pro-image-preview (Nano Banana Pro)",
            font=("Segoe UI", 12, "bold"),
        )
        header.pack(anchor="w", **padding)

        form_frame = ttk.Frame(self.root)
        form_frame.pack(fill="x", **padding)

        ttk.Label(form_frame, text="API key (blank uses GEMINI_API_KEY/GOOGLE_API_KEY):").grid(
            row=0, column=0, sticky="w"
        )
        api_entry = ttk.Entry(form_frame, textvariable=self.api_key_var, width=70, show="*")
        api_entry.grid(row=0, column=1, sticky="we", padx=(6, 0))
        form_frame.columnconfigure(1, weight=1)

        ttk.Label(form_frame, text="Aspect ratio:").grid(row=1, column=0, sticky="w")
        ttk.Combobox(
            form_frame, textvariable=self.aspect_var, values=ASPECT_RATIOS, width=10, state="readonly"
        ).grid(row=1, column=1, sticky="w", padx=(6, 0))

        ttk.Label(form_frame, text="Resolution:").grid(row=2, column=0, sticky="w")
        ttk.Combobox(
            form_frame, textvariable=self.resolution_var, values=RESOLUTIONS, width=10, state="readonly"
        ).grid(row=2, column=1, sticky="w", padx=(6, 0))

        output_frame = ttk.Frame(self.root)
        output_frame.pack(fill="x", **padding)
        ttk.Label(output_frame, text="Output folder:").grid(row=0, column=0, sticky="w")
        ttk.Entry(output_frame, textvariable=self.output_dir_var, width=70).grid(
            row=0, column=1, sticky="we", padx=(6, 0)
        )
        ttk.Button(output_frame, text="Browse", command=self._pick_directory).grid(
            row=0, column=2, padx=(6, 0)
        )
        output_frame.columnconfigure(1, weight=1)

        ttk.Label(self.root, text="Prompts (one per line):").pack(anchor="w", **padding)
        self.prompt_text = tk.Text(self.root, height=10, wrap="word")
        self.prompt_text.pack(fill="both", expand=False, **padding)

        control_frame = ttk.Frame(self.root)
        control_frame.pack(fill="x", **padding)
        self.run_button = ttk.Button(control_frame, text="Generate images", command=self._start_generation)
        self.run_button.pack(side="left")

        ttk.Label(control_frame, text="Model: gemini-3-pro-image-preview (Nano Banana Pro)").pack(
            side="left", padx=(12, 0)
        )

        ttk.Label(self.root, text="Log:").pack(anchor="w", **padding)
        self.log_box = tk.Text(self.root, height=14, state="disabled", wrap="word")
        self.log_box.pack(fill="both", expand=True, **padding)

    def _pick_directory(self) -> None:
        selection = filedialog.askdirectory(initialdir=self.output_dir_var.get() or os.getcwd())
        if selection:
            self.output_dir_var.set(selection)

    def _append_log(self, message: str) -> None:
        self.log_box.configure(state="normal")
        self.log_box.insert("end", message + "\n")
        self.log_box.see("end")
        self.log_box.configure(state="disabled")

    def _log(self, message: str) -> None:
        self.root.after(0, lambda: self._append_log(message))

    def _toggle_running(self, running: bool) -> None:
        def _apply() -> None:
            self.running = running
            state = "disabled" if running else "normal"
            self.run_button.configure(state=state)

        self.root.after(0, _apply)

    def _start_generation(self) -> None:
        if self.running:
            return
        worker = threading.Thread(target=self._generate_batch, daemon=True)
        worker.start()

    def _generate_batch(self) -> None:
        self._toggle_running(True)
        try:
            prompts = [
                line.strip()
                for line in self.prompt_text.get("1.0", "end").splitlines()
                if line.strip()
            ]
            if not prompts:
                self._log("Add at least one prompt (one per line).")
                return

            api_key = self.api_key_var.get().strip() or os.getenv("GOOGLE_API_KEY") or os.getenv(
                "GEMINI_API_KEY"
            )
            if not api_key:
                self._log("Missing API key. Set GEMINI_API_KEY or enter a key above.")
                return

            output_dir = self.output_dir_var.get().strip() or os.path.join(
                os.getcwd(), "nano_banana_outputs"
            )
            os.makedirs(output_dir, exist_ok=True)

            client = genai.Client(api_key=api_key)
            cfg = types.GenerateContentConfig(
                response_modalities=["IMAGE"],
                image_config=types.ImageConfig(
                    aspect_ratio=self.aspect_var.get(),
                    image_size=self.resolution_var.get(),
                ),
            )

            total = len(prompts)
            for idx, prompt in enumerate(prompts, start=1):
                short_prompt = (prompt[:80] + "...") if len(prompt) > 80 else prompt
                self._log(f"[{idx}/{total}] {short_prompt}")
                try:
                    response = client.models.generate_content(
                        model=MODEL_ID,
                        contents=[prompt],
                        config=cfg,
                    )
                except Exception as exc:
                    self._log(f"  Error: {exc}")
                    continue

                saved = self._save_images(response, output_dir, idx, prompt)
                if saved == 0:
                    if response.text:
                        self._log(f"  No image returned. Text response: {response.text}")
                    else:
                        self._log("  No image returned.")
        finally:
            self._toggle_running(False)

    def _save_images(self, response: types.GenerateContentResponse, output_dir: str, idx: int, prompt: str) -> int:
        saved = 0
        safe_stub = re.sub(r"[^A-Za-z0-9]+", "_", prompt).strip("_") or "image"
        for part_idx, part in enumerate(response.parts, start=1):
            if getattr(part, "text", None):
                continue
            image = part.as_image()
            if image:
                filename = f"{idx:02d}_{safe_stub}_{part_idx}.png"
                path = os.path.join(output_dir, filename)
                image.save(path)
                self._log(f"  Saved {path}")
                saved += 1
        return saved


if __name__ == "__main__":
    root = tk.Tk()
    app = NanoBananaGUI(root)
    root.mainloop()
