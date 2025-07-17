# Chatbot

Un chatbot inteligente con interfaz web moderna que se conecta a modelos de lenguaje locales a través de LM Studio (o el modelo que se desee).

## 🚀 Características

- Interfaz web moderna y responsiva
- Conexión con modelos de lenguaje locales a través de LM Studio
- Efecto de escritura en tiempo real
- Historial de conversación
- Diseño similar a ChatGPT
- Fácil de personalizar y extender

## 🛠️ Requisitos Previos

- Python 3.8 o superior
- LM Studio ejecutándose localmente o una API REST que responda a las peticiones del chatbot
- Node.js y npm (opcional, para desarrollo frontend)

## 🏗️ Estructura del Proyecto

chatbot_project/
│
├── backend/
│   └── api.py          # API FastAPI para el chatbot
│   └── chatbot.py      # Lógica principal del chatbot
│
├── frontend/
│   ├── static/
│   │   └── style.css   # Estilos CSS
│   ├── templates/
│   │   └── index.html  # Plantilla HTML
│   └── app.py          # Aplicación Flask para el frontend
│
└── requirements.txt    # Dependencias del proyecto