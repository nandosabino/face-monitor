# 🎯 Face Monitor - Reconhecimento Facial em Tempo Real

Aplicação web que realiza **detecção facial em tempo real** usando a webcam do usuário, exibe métricas analíticas em um dashboard e registra dados no Firebase Firestore.  
Desenvolvido como desafio técnico fullstack.

---

## 🚀 Demonstração

🖼️ [Visualizar mock (v0.dev)](https://v0-real-time-facial-monitoring-1us0ws26d.vercel.app)  
📺 [Deploy final (Vercel)](https://face-monitor.vercel.app)

---

## 🧠 Funcionalidades

- 📹 Captura de vídeo em tempo real da webcam
- 🧠 Detecção facial com `@vladmandic/face-api`
- 🟢 Identificação de:
  - Idade estimada
  - Gênero
  - Expressão facial
  - **Distância estimada** até a câmera
- 🧾 Armazenamento dos dados em tempo real no Firebase Firestore
- 📊 Dashboard com:
  - Total de pessoas detectadas
  - Tempo médio de permanência
  - Pico de fluxo por hora
  - Expressão mais comum
  - Gráfico por hora com `recharts`
- 🔁 Evita contagem duplicada com `faceDescriptor + timeout`
- 🎨 Interface moderna com Tailwind CSS
- 🔒 Controle de detecção única por pessoa

---

## ⚙️ Tecnologias utilizadas

- React + Vite
- Tailwind CSS
- Firebase (Firestore)
- @vladmandic/face-api (detecção facial)
- Recharts (gráficos)
- date-fns (manipulação de datas)

---

## 📦 Instalação local

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/face-monitor.git
cd face-monitor

```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo ```.env.local``` e adicione as chaves do Firebase:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

4. Rode o projeto:

```bash
npm run dev
```

🔧 Estrutura do projeto

```css
src/
├── components/
│   ├── LiveVideoCard.jsx
│   ├── Dashboard.jsx
├── hooks/
│   └── useDashboardData.js
├── lib/
│   └── firebase.js
├── App.jsx
└── main.jsx
```

📄 Licença
MIT — livre para uso pessoal e educacional.

🙋‍♂️ Autor
Fernando Sabino
https://www.linkedin.com/in/nandosabino/ | https://github.com/nandosabino
