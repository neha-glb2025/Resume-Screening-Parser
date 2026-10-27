# Resume Check: Resume Screening Tool for Technical Placements

**Minor Project** | B.Tech Computer Science and Engineering, MANIT Bhopal
Student: Vikash | Roll No: ________ | Guide: ________

## 1. Abstract
Campus recruiters shortlist resumes in seconds, often through Applicant Tracking Systems (ATS). This project is a browser-based tool that reads a student's resume (PDF or text), checks it against criteria used for technical placements and internships, and returns a score out of 100 with a checklist of what to fix. It uses only HTML, CSS, JavaScript and the open-source PDF.js library. No server or database is needed, and the resume never leaves the user's device.

## 2. Objectives
- Let a student upload a resume as a PDF and extract its text.
- Check structure, contact links, skills and writing quality.
- Match skills against the role applied for (SDE, Web Developer, Data Science/ML).
- Give a score, a verdict and specific tips for improvement.

## 3. Technologies Used
| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (Grid, Flexbox, CSS variables, dark mode) |
| Logic | JavaScript (ES6), Regular Expressions |
| PDF reading | PDF.js (Mozilla) |

## 4. Project Structure
```
resume-checker-project/
  index.html   page layout and controls
  style.css    design and responsive layout
  script.js    PDF reading, analysis rules, score display
  README.md    this report
```

## 5. Working
1. The user picks a target role and uploads a PDF or pastes text.
2. PDF.js reads every page and rebuilds the text line by line.
3. `analyze()` runs 14 rule-based checks on the lowercased text.
4. Each check earns points. The sum is the final score.
5. `render()` shows the animated score ring, verdict, matched and missing skills, and the checklist.

### Scoring scheme (total 100)
| Category | Checks | Points |
|---|---|---|
| Contact and links | Email 8, phone 4, GitHub 5, LinkedIn 3 | 20 |
| Sections | Education 8, CGPA 4, skills 8, projects 10, experience/achievements 5 | 35 |
| Role skill match | Keywords found / keywords expected for the role | 25 |
| Writing quality | Action verbs 7, quantified results 6, length 4, no filler phrases 3 | 20 |

Verdict: 75 and above is *Ready to apply*, 55 to 74 is *Almost there*, below 55 is *Needs work*.

## 6. How to Run
Open `index.html` in any modern browser. An internet connection is needed once to load PDF.js and the fonts from a CDN.

## 7. Limitations
- It is rule-based, so it checks structure and keywords, not the real quality of projects.
- Scanned (image-only) PDFs have no text layer and cannot be read.
- Keyword lists are fixed in the code and cover three roles.

## 8. Future Scope
- Match a resume against a pasted job description.
- OCR for scanned PDFs.
- More roles (Android, DevOps, Cybersecurity).
- Machine-learning scoring trained on shortlisted resumes.

## 9. Conclusion
The tool shows how basic web technologies can solve a real student problem: a fast, private, explainable first check of a resume before it reaches a recruiter.
