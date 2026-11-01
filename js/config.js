
window.APP_CONFIG = {
  
  binDepthCm: 30,

  levels: [
    { max: 25,  name: "Vazia ou quase vazia",     range: "0–25%",   color: "#2EB85C" },
    { max: 50,  name: "Em uso",                   range: "25–50%",  color: "#FFD60A" },
    { max: 75,  name: "Ficando cheia",            range: "50–75%",  color: "#FF9500" },
    { max: 101, name: "Cheia — hora de esvaziar", range: "75–100%", color: "#E5383B" }
  ],

  team: [ 
    { name: "Ana Clara", role: "Design e Comunicação Visual", photo: "assets/team/Ana.png" },          
    { name:"Iris Guimarães", role: "Gestão Estratégia e Principios", photo: "assets/team/Iris.png" },         
    { name: "Lucas Sales", role: "Desenvolvimento Web e Apresentação", photo: "assets/team/Lucas.png" },     
    { name: "Rafaella Alcasser", role: "Engenharia IoT e Automação", photo: "assets/team/Rafa Alcasser.png" }, 
    { name: "Rafaella Barroso", role: "Documentação e Qualidade", photo: "assets/team/Rafaella.png" }      
  ],

  project: {
    members: null,   
    course: null,
    institution: null,
    subject: null,
    year: null
  },

  googleSheetsUrl: "https://script.google.com/macros/s/AKfycbwyEAEx_h0bGJjKtaEmEogTgxNNeg09vjG0cAVyYUC-3-vHnxz6fn_HXqQ6ehkTnig/exec"
};

