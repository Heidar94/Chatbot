from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chatbot import Chatbot
import traceback

app = FastAPI()
chatbot = Chatbot()

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    content: str

@app.post("/chat")
async def chat(message: Message, request: Request):
    try:
        # data = await request.json()
        # user_message = data.get("message", "")
        
        # Verificar si la solicitud fue cancelada
        if await request.is_disconnected():
            return JSONResponse(
                status_code=499,  # Código para "Client Closed Request"
                content={"response": "Solicitud cancelada por el usuario"}
            )

        print(f"Recibido mensaje: {message.content}")  # Debug
        response = chatbot.get_response(message.content)
        return {"response": response}
    except Exception as e:
        # Imprimir el error completo en la consola
        error_trace = traceback.format_exc()
        print(f"Error en /chat: {str(e)}\n{error_trace}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "traceback": error_trace
            }
        )

@app.post("/reset")
async def reset_chat():
    try:
        chatbot.reset_conversation()
        return {"status": "Conversación reiniciada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)