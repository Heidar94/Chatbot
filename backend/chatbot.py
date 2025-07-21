import requests

class Chatbot:
    def __init__(self, api_url: str = "http://127.0.0.1:1234/v1/chat/completions"):
        self.api_url = api_url
        self.conversation = [{"role": "system", "content": "Eres un asistente útil y amigable."}]

    def get_response(self, user_input: str) -> str:
        """Envía el mensaje al modelo y devuelve la respuesta"""
        self.conversation.append({"role": "user", "content": user_input})
        
        try:
            print(f"Enviando a {self.api_url}")  # Debug
            print(f"Payload: {self.conversation}")  # Debug
            
            response = requests.post(
                self.api_url,
                json={
                    "messages": self.conversation,
                    "max_tokens": 500,
                    "temperature": 0.7
                },
                timeout=60
            )
            
            print(f"Respuesta del servidor: {response.status_code}")  # Debug
            print(f"Contenido de la respuesta: {response.text}")  # Debug
            
            if response.status_code == 200:
                bot_response = response.json()["choices"][0]["message"]["content"]
                self.conversation.append({"role": "assistant", "content": bot_response})
                return bot_response
            else:
                return f"Error en la respuesta del servidor (Código {response.status_code}): {response.text}"
                
        except Exception as e:
            return f"Error de conexión: {str(e)}"

    def reset_conversation(self):
        """Reinicia la conversación"""
        self.conversation = [{"role": "system", "content": "Eres un asistente útil y amigable."}]