import uvicorn
import threading
import gradio as gr
from app.main import app as fastapi_app

# run FastAPI in a background thread
def run_fastapi():
    uvicorn.run(fastapi_app, host="0.0.0.0", port=7860)

thread = threading.Thread(target=run_fastapi, daemon=True)
thread.start()

# Gradio needs a UI to stay alive — minimal dummy interface
demo = gr.Interface(
    fn=lambda x: "Emosaic backend is running!",
    inputs=gr.Textbox(label="ping"),
    outputs=gr.Textbox(label="status"),
    title="🌸 Emosaic Backend",
    description="FastAPI backend for Emosaic. Use the /generate endpoint."
)

demo.launch(server_port=7860)