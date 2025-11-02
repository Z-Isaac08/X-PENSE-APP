# 🚀 SETUP - Guide d'Installation

## 📋 Prérequis

- Node.js >= 18
- npm ou yarn
- Compte Firebase
- Compte Groq (pour l'agent IA)

---

## ⚙️ Installation

### **1. Cloner le Projet**

```bash
git clone https://github.com/Z-Isaac08/X-PENSE-APP.git
cd X-PENSE-APP
```

### **2. Installer les Dépendances**

```bash
npm install
```

### **3. Configurer les Variables d'Environnement**

#### **Créer le fichier `.env`**

```bash
cp .env.example .env
```

#### **Remplir le fichier `.env`**

Ouvrir `.env` et compléter avec vos propres clés :

```env
# Firebase (Obtenir sur https://console.firebase.google.com)
VITE_FIREBASE_API_KEY=votre_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_projet_id
VITE_FIREBASE_STORAGE_BUCKET=votre_projet.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
VITE_FIREBASE_MEASUREMENT_ID=votre_measurement_id

# Groq API (Obtenir sur https://console.groq.com/keys)
GROQ_API_KEY=votre_groq_api_key
```

---

## 🔑 Obtenir les Clés API

### **Firebase**

1. Aller sur https://console.firebase.google.com
2. Créer un nouveau projet ou utiliser un existant
3. **Authentication** → Activer Email/Password
4. **Firestore Database** → Créer une base de données
5. **Project Settings** → Copier les credentials
6. Coller dans `.env`

### **Groq API**

1. Aller sur https://console.groq.com
2. Créer un compte (gratuit)
3. **API Keys** → Créer une nouvelle clé
4. Copier la clé et la coller dans `.env` (`GROQ_API_KEY`)

---

## 🏃 Lancer le Projet

### **Développement Local**

#### **Option 1 : Avec Vercel Dev (Recommandé)**

Pour que le backend proxy fonctionne :

```bash
# Installer Vercel CLI
npm install -g vercel

# Lancer
vercel dev
```

Ouvrir http://localhost:3000

#### **Option 2 : Avec Vite uniquement**

⚠️ Le backend proxy ne fonctionnera pas, mais le frontend oui :

```bash
npm run dev
```

Ouvrir http://localhost:5173

---

## 🧪 Tester l'Application

1. Créer un compte
2. Se connecter
3. Créer un budget
4. Ajouter une dépense
5. Tester l'agent IA sur `/h/chat`

---

## 🚀 Déploiement

### **Sur Vercel**

1. Fork le projet sur GitHub
2. Aller sur https://vercel.com
3. Importer le projet
4. **Important** : Configurer les variables d'environnement :
   - `GROQ_API_KEY` : Votre clé Groq
5. Déployer

### **Configurer Firebase pour Production**

1. Firebase Console → Authentication → Settings → Authorized domains
2. Ajouter votre domaine Vercel : `votre-app.vercel.app`

---

## 📁 Structure du Projet

```
.
├── api/                # Backend Serverless (Vercel)
│   └── chat.js        # Proxy Groq API
├── src/
│   ├── components/    # Composants React
│   ├── pages/         # Pages
│   ├── stores/        # Zustand stores
│   ├── services/
│   │   ├── agent/     # Agent IA
│   │   └── analytics/ # Analyses financières
│   ├── config/        # Configuration
│   └── types/         # Types TypeScript
├── .env.example       # Template variables d'env
└── vercel.json        # Config Vercel
```

---

## 🆘 Dépannage

### **Erreur : Agent IA ne répond pas**

- Vérifier que `GROQ_API_KEY` est dans `.env`
- Utiliser `vercel dev` au lieu de `npm run dev`
- Vérifier la clé sur https://console.groq.com

### **Erreur : Firebase Auth**

- Vérifier les credentials Firebase dans `.env`
- Vérifier que Email/Password est activé dans Firebase Auth

### **Erreur : Build Failed**

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Documentation

- **README.md** : Vue d'ensemble
- **docs/** : Documentation complète
  - `AGENT_IA_ARCHITECTURE.md` : Architecture de l'agent IA
  - `GUIDE_DEPLOIEMENT.md` : Guide de déploiement
  - `PARTAGE_SECURISE.md` : Partage sécurisé

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/Feature`)
3. Commit (`git commit -m 'Add Feature'`)
4. Push (`git push origin feature/Feature`)
5. Ouvrir une Pull Request

---

## 📝 Licence

MIT License

---

## 💡 Notes Importantes

- ⚠️ **Ne jamais commit le fichier `.env`** (il contient vos clés secrètes)
- ✅ Le fichier `.env.example` est un template sans vraies clés
- ✅ Chaque développeur doit créer son propre `.env` avec ses propres clés
- ✅ En production (Vercel), les variables sont dans le Dashboard

---

**Besoin d'aide ?** Ouvrir une issue sur GitHub !
