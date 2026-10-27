const ROLES = {
  sde:{name:"Software Engineer",kw:["data structures","algorithms","c++","java","python","oop|object-oriented","dbms|database","operating system","computer network","sql","git","leetcode|codeforces|codechef","system design","problem solving","linux","time complexity|complexity"]},
  web:{name:"Web Developer",kw:["html","css","javascript","react","node","express","mongodb|mysql|postgres","rest|api","git","typescript","tailwind|bootstrap","responsive","deploy","authentication|jwt","next.js|nextjs","sql"]},
  ml:{name:"Data Science / ML",kw:["python","numpy","pandas","scikit-learn|sklearn","machine learning","deep learning","tensorflow|pytorch|keras","sql","statistics","nlp|natural language","data visualization|matplotlib|seaborn","jupyter","model","regression|classification","git","data cleaning|preprocessing"]}
};
const VERBS = ["built","developed","designed","implemented","created","led","optimized","reduced","improved","deployed","automated","engineered","integrated","launched","solved","achieved","managed","captained","organized","analyzed","trained","architected","collaborated","secured","won","increased","migrated","tested","refactored","mentored"];
const WEAK = ["responsible for","hardworking","hard-working","team player","hard worker","objective","fast learner","passionate about","references available"];
const $ = id => document.getElementById(id);

const SAMPLE = `Vikash Kumar
vikash@example.com | +91 98765 43210 | github.com/vikash-dev | linkedin.com/in/vikash-dev

EDUCATION
B.Tech, Computer Science and Engineering, MANIT Bhopal | CGPA: 8.4/10 | 2023 - 2027

SKILLS
Languages: C++, Java, Python, JavaScript, SQL
Web: HTML, CSS, React, Node.js, Express, MongoDB
Core: Data Structures, Algorithms, OOP, DBMS, Operating Systems, Git, Linux

PROJECTS
Chat Assistant (React, Node.js, REST API)
- Built a real-time chat assistant used by 120+ students, with JWT authentication
- Reduced average response time by 35% by caching frequent queries
- Deployed on a free cloud tier with CI checks on every push

ACHIEVEMENTS
- Solved 450+ problems on LeetCode and Codeforces; rated 1500+ on Codeforces
- Captained the department volleyball team to 2 inter-department titles
- Class Representative for a batch of 60 students`;

function has(text, kw){ return kw.split("|").some(k => text.includes(k)); }

function analyze(raw, roleKey){
  const text = raw.toLowerCase();
  const words = (raw.match(/\S+/g)||[]).length;
  const role = ROLES[roleKey];
  const out = [];
  const add = (label, max, got, tip, okMsg) => out.push({label,max,got,tip: got>=max ? okMsg : tip});

  const email = /[\w.+-]+@[\w-]+\.[\w.]+/.test(raw);
  add("Email address",8,email?8:0,"Add a professional email at the top, ideally your name.","Contact email found.");
  const phone = /(\+?\d[\d\s-]{8,}\d)/.test(raw);
  add("Phone number",4,phone?4:0,"Recruiters call. Add a number with country code.","Phone number found.");
  const gh = /github\.com\/[\w-]+/.test(text) ? 5 : (text.includes("github") ? 2 : 0);
  add("GitHub profile",5,gh,gh ? "You mention GitHub but there is no full link. Paste the real profile URL." : "Add your GitHub link. Recruiters check your code.","GitHub link found.");
  const li = /linkedin\.com\/in\/[\w-]+/.test(text) ? 3 : (text.includes("linkedin") ? 1 : 0);
  add("LinkedIn profile",3,li,li ? "Add the full LinkedIn URL." : "Add your LinkedIn link.","LinkedIn link found.");

  add("Education section",8,/\b(education|academic|b\.?tech|bachelor)/.test(text)?8:0,"Add an Education section with degree, college and years.","Education section found.");
  const cg = /(cgpa|gpa|percentage|\b\d(\.\d+)?\s*\/\s*10\b|\b\d{2}(\.\d+)?\s*%)/.test(text);
  add("CGPA or percentage",4,cg?4:0,"Many companies filter on CGPA. State yours.","Academic score stated.");
  add("Skills section",8,/\b(skills|technologies|tech stack|technical)/.test(text)?8:0,"Add a Skills section grouped by languages, tools and core subjects.","Skills section found.");
  add("Projects section",10,/\bprojects?\b/.test(text)?10:0,"Add 2–3 projects with the tech used and what you built.","Projects section found.");
  const exp = /(intern|experience|achievement|leadership|responsibilit|hackathon|certification|award|winner|rated)/.test(text);
  add("Experience or achievements",5,exp?5:0,"Add an internship, hackathon, leadership role or achievement.","Experience or achievements found.");

  const hits = role.kw.filter(k => has(text,k));
  const missing = role.kw.filter(k => !has(text,k));
  const kwPts = Math.round(25 * hits.length / role.kw.length);
  add(`Skill match for ${role.name}`,25,kwPts,`You match ${hits.length} of ${role.kw.length} expected skills. Add the missing ones you really know.`,"Strong match with expected skills.");

  const vf = VERBS.filter(v => new RegExp("\\b"+v).test(text)).length;
  add("Action verbs",7,Math.min(7,Math.round(vf*7/6)),`Found ${vf} strong verbs. Start bullets with words like Built, Reduced, Deployed.`,"Good use of action verbs.");

  const cleaned = raw.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g," ").replace(/\+?\d[\d\s-]{8,}\d/g," ").replace(/\b(19|20)\d{2}\b/g," ").replace(/\b\d\.\d+\s*\/\s*10\b/g," ");
  const nums = (cleaned.match(/\b\d+(\.\d+)?\s?(%|\+|x|k|ms)?/g)||[]).length;
  add("Numbers and impact",6,Math.min(6,Math.round(nums*6/4)),`Only ${nums} numbers found. Quantify results: users, % faster, problems solved.`,"Results are quantified.");

  const lenPts = words>=200 && words<=700 ? 4 : (words>=120 && words<=900 ? 2 : 0);
  add("Length",4,lenPts,`${words} words. Aim for 250–600 so it fits one page without feeling empty.`,`${words} words: a good one-page length.`);

  const weak = WEAK.filter(w => text.includes(w));
  add("Filler phrases",3,weak.length===0?3:(weak.length===1?1:0),`Remove filler like “${weak.join("”, “")}”. Show it with projects instead.`,"No filler phrases.");

  const total = out.reduce((s,c)=>s+c.got,0);
  return {out,total,hits,missing,role,words};
}

function render(r){
  const t = r.total;
  const v = t>=75 ? ["Ready to apply","Your resume covers what recruiters scan for. Polish the items below and send it out.","var(--ok)"]
          : t>=55 ? ["Almost there","A few fixes will lift this into the shortlist range. Start with the red items.","var(--warn)"]
          : ["Needs work","Not ready for placement rounds yet. Fix the failed items first, then check again.","var(--bad)"];
  const C = 2*Math.PI*54;
  const rows = r.out.map(c=>{
    const cls = c.got>=c.max ? "pass" : c.got>0 ? "part" : "fail";
    const word = {pass:"Pass",part:"Partial",fail:"Missing"}[cls];
    return `<li><span class="tag ${cls}">${word}</span><span><strong>${c.label}</strong><small>${c.tip}</small></span><span class="pts">${c.got}/${c.max}</span></li>`;
  }).join("");
  $("report").innerHTML = `
    <div class="score">
      <div class="ring" role="img" aria-label="Score ${t} out of 100">
        <svg width="140" height="140" viewBox="0 0 140 140"><circle class="track" cx="70" cy="70" r="54" fill="none" stroke-width="12"/><circle class="bar" id="bar" cx="70" cy="70" r="54" fill="none" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>
        <b>${t}</b>
      </div>
      <div><div class="verdict" style="color:${v[2]}">${v[0]}</div><div class="verdict-sub">${v[1]}</div></div>
    </div>
    <h3>Skills for ${r.role.name}</h3>
    <div class="chips">${r.hits.map(k=>`<span class="chip y">Found: ${k.split("|")[0]}</span>`).join("")}${r.missing.map(k=>`<span class="chip n">Missing: ${k.split("|")[0]}</span>`).join("")}</div>
    <h3>Checklist</h3>
    <ul class="chk">${rows}</ul>`;
  const bar = $("bar"); bar.style.stroke = v[2];
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ bar.style.strokeDashoffset = C*(1-t/100); }));
}

$("go").onclick = () => {
  const raw = $("resume").value.trim();
  if(raw.length < 50){
    $("report").innerHTML = `<p class="empty">Paste at least a few lines of your resume, then press “Check my resume”.</p>`;
    return;
  }
  render(analyze(raw, $("role").value));
};
$("sample").onclick = () => { $("resume").value = SAMPLE; $("go").click(); };
$("clear").onclick = () => { $("resume").value = ""; $("report").innerHTML = `<p class="empty">Your report will appear here.</p>`; };
$("filebtn").onclick = () => $("file").click();
async function pdfToText(buf){
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const pdf = await pdfjsLib.getDocument({data:buf}).promise;
  let out = "";
  for(let p=1;p<=pdf.numPages;p++){
    const content = await (await pdf.getPage(p)).getTextContent();
    let line = "", y = null;
    for(const it of content.items){
      if(y!==null && Math.abs(it.transform[5]-y)>2){ out += line.trim()+"\n"; line = ""; }
      line += it.str+" "; y = it.transform[5];
    }
    out += line.trim()+"\n";
  }
  return out;
}
$("file").onchange = async e => {
  const f = e.target.files[0]; if(!f) return;
  const st = $("status");
  try{
    let text;
    if(f.type==="application/pdf" || /\.pdf$/i.test(f.name)){
      st.textContent = "Reading "+f.name+"…";
      text = await pdfToText(await f.arrayBuffer());
    } else { text = await f.text(); }
    if(text.trim().length < 50){
      st.textContent = "No readable text found. This PDF may be a scanned image. Export a text-based PDF from Word or Docs and try again.";
      return;
    }
    $("resume").value = text;
    st.textContent = "Loaded "+f.name+". You can edit the text below before checking.";
    $("go").click();
  }catch(err){
    st.textContent = "Could not read this file. Try another PDF or paste the text instead.";
  }
  e.target.value = "";
};
