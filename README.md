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

## 🖥️ Uso

1. Clonar el repositorio:
```bash
git clone [url]
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Iniciar el servidor:
Abrir una terminal, situarse en la carpeta backend y ejecutar:
```bash
cd backend
uvicorn api:app --reload
```

4. Iniciar el frontend:
Abrir una terminal, situarse en la carpeta frontend y ejecutar:
```bash
cd frontend
python app.py
```

## 🏗️ Estructura del Proyecto

````markdown
## 🏗️ Estructura del Proyecto

```bash
chatbot_project/
│
├── backend/
│   ├── api.py          # API FastAPI para el chatbot
│   └── chatbot.py      # Lógica principal del chatbot
│
├── frontend/
│   ├── static/
│   │   ├── style.css   # Estilos CSS
│   │   └── script.js   # Script JavaScript
│   ├── templates/
│   │   └── index.html  # Plantilla HTML
│   └── app.py          # Aplicación Flask para el frontend
│
├── notebook/
│   └── chatbot.ipynb   # Notebook de Jupyter
│
└── README.md           # Documentación
```

La estructura sigue el patrón de arquitectura "Backend-Frontend" o "API + Web Interface", con una separación clara de responsabilidades. Específicamente, se asemeja a una variante del patrón MVC (Modelo-Vista-Controlador):

- Backend (Modelo + Controlador):
    - chatbot.py: Maneja la lógica del negocio (Modelo)
    - api.py: Expone los endpoints de la API (Controlador)
- Frontend (Vista):
    - Archivos estáticos (HTML, CSS, JS) para la interfaz de usuario
Esta estructura también sigue las mejores prácticas de Arquitectura de Microservicios, donde el frontend y el backend están completamente desacoplados y se comunican a través de una API REST.

Nombres específicos para esta estructura:
- "API-First Architecture": Donde primero defines la API y luego construyes el frontend que la consume.
- "Three-Tier Architecture" (Arquitectura de Tres Capas):
    Capa de Presentación: Frontend (HTML/CSS/JS)
    Capa de Lógica de Negocio: Backend (Python/FastAPI)
    Capa de Datos: El modelo de lenguaje (LM Studio)
- "SPA + API": Single Page Application + API backend
- "Jamstack": Aunque típicamente usa servicios serverless, la separación es similar.