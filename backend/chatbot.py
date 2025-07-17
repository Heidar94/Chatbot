class Chatbot:
    def __init__(self, api_url : str="http://127.0.0.1:1234/api/chat/completions"):
        self.api_url = api_url
        self.conversation = [{"role": "system", "content": "Eres un asistente útil y amigable."}]
    
    def get_response(self, message : str)->str:
        """Envía el mensaje al modelo y devuelve la respuesta"""
        self.conversation.append({"role": "user", "content": user_input})
        
        try:
            response = requests.post(
                self.api_url,
                json={
                    "messages": self.conversation,
                    "max_tokens": 500
                },
                timeout=60
            )
            
            if response.status_code == 200:
                bot_response = response.json()["choices"][0]["message"]["content"]
                self.conversation.append({"role": "assistant", "content": bot_response})
                return bot_response
            else:
                return f"Error en la respuesta del servidor (Código {response.status_code})"
                
        except Exception as e:
            return f"Error de conexión: {str(e)}"

    def reset_conversation(self):
        """Reinicia la conversación"""
        self.conversation = [{"role": "system", "content": "Eres un asistente útil y amigable."}]