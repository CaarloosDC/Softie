# NeoSync - Softies

## Link de video de youtube de pruebas
https://youtu.be/1hPmd7niZwk

Neosync es una plataforma de gestion de preventa de proyectos de software que utiliza Inteligenecia Artificial para eficientizar y agilizar el proceso de preventa.

## Índice
1. [Diagrama de Componentes](#diagrama-de-componentes)
2. [Prueba Técnica de AI](#prueba-técnica-de-ai)
3. [Aplicación de AI en la Solución](#aplicación-de-ai-en-la-solución)

## Diagrama de Componentes

Aquí puedes ver el diagrama de componentes y el stack tecnológico definido hasta el momento:

![Diagrama de Componentes](README_Assets/Softies%20-%20Propuesta%20Final.jpg)

### Descripción del Stack Tecnológico:
- **Frontend**:
  - **Next.js**: Framework de React para aplicaciones web.
  - **Typescript**: Añade tipado estático a JavaScript.
  - **Shadcn/UI**: Sistema de componentes UI basado en Tailwind CSS.
  - **Tailwind CSS**: Un framework de CSS para diseño rápido y eficiente.

- **Backend**:
  - **Supabase**: Plataforma backend que incluye almacenamiento y autenticación.
  - **PostgreSQL**: Base de datos relacional utilizada para la persistencia de datos.

- **Componentes Externos**:
  - **Pinecone**: Servicio para indexar y buscar vectores, clave para la búsqueda.
  - **LLaMA de Meta**: Modelo de lenguaje (LLM) utilizado para capacidades avanzadas de AI, como procesamiento de lenguaje natural (NLP).

- **Deployment / CI/CD**:
  - **Vercel**: Plataforma de despliegue para proyectos de frontend.
  - **Docker**: Herramienta para contenerización y despliegue de aplicaciones.
  - **GitHub Actions**: Automatización de flujos de trabajo para CI/CD.

---

## Prueba Técnica de AI

Hemos realizado una prueba técnica inicial con **LLaMA**, que se encuentra en el directorio del proyecto: [Prueba Técnica de AI](llama%20API/llama-test.ipynb). Esta prueba valida la integración básica con el modelo LLaMA y su potencial para realizar tareas avanzadas.

---

## Aplicación de AI en la Solución

El uso de inteligencia artificial en **NEOSYNC** será clave para mejorar la experiencia del usuario. Implementaremos AI de las siguientes formas:

1. **Agente Inteligente**: 
   - El sistema contará con un agente que tendrá conocimiento de las tareas asignadas, permitiendo automatizar acciones y generar recomendaciones proactivas.

2. **Asistente Personalizado**:
   - Se integrará un ayudante que proporcionará recomendaciones específicas a los usuarios registrados. Esto será visible mediante:
     - Notificaciones personalizadas para eficientizar el trabajo.
     - Botones de ayuda para generar propuestas automáticas.
     - Chatbot para asistir en preguntas frecuentes y guiar al usuario.

Este enfoque permitirá mejorar la eficiencia del sistema y la interacción con los usuarios, adaptándose a sus necesidades en tiempo real.

---

Para más detalles, ponte en contacto con el equipo.
