export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:"OPENAI_API_KEY is not configured on the server."});
  try{
    const {question,subject="General",mode="explain",level="Beginner"}=req.body||{};
    if(!question||typeof question!=="string") return res.status(400).json({error:"Please provide a question."});
    const modeInstructions={
      explain:"Explain the topic clearly, using simple language, examples, and a short recap.",
      steps:"Solve or explain the problem step by step. Show the reasoning in a way a student can learn from.",
      quiz:"Create 5 practice questions about the topic, then provide an answer key after the questions.",
      flashcards:"Create 8 useful flashcards. Format each as QUESTION: ... / ANSWER: ...",
      summary:"Give a concise study summary with the key ideas, important terms, and a short recap."
    };
    const prompt=[
      "You are StudyAI, a friendly educational tutor.",
      "Subject: "+subject,
      "Student level: "+level,
      "Task: "+(modeInstructions[mode]||modeInstructions.explain),
      "Student question:",
      question,
      "Help the student learn rather than simply encouraging them to copy an answer. Be accurate and age-appropriate."
    ].join("\n\n");
    const response=await fetch("https://api.openai.com/v1/responses",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.OPENAI_API_KEY},
      body:JSON.stringify({model:"gpt-5.6-luna",input:prompt})
    });
    const data=await response.json();
    if(!response.ok) return res.status(response.status).json({error:data?.error?.message||"AI request failed."});
    let answer=data.output_text;
    if(!answer && Array.isArray(data.output)){
      answer=data.output.flatMap(x=>x.content||[]).map(x=>x.text||"").filter(Boolean).join("\n");
    }
    return res.status(200).json({answer:answer||"The AI returned an empty response."});
  }catch(error){
    return res.status(500).json({error:"Server error: "+error.message});
  }
}