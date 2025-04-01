const express = require("express");
const { spawn } = require("child_process");
const fs = require("fs");
const app = express();
const port = 3000;

const pl = require("tau-prolog");
const loader = require("tau-prolog/modules/lists.js");
const cors = require("cors");
loader(pl);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const session = pl.create(1000);
// const show = x => console.log(session.format_answer(x));

// Get Node.js argument: node ./script.js item
const item = process.argv[2];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/home.html");
});

// Career Recommendation DSS Logic
app.get("/career-recommendations", (req, res) => {
  const { interests, skills } = req.query;

  // 1. Prolog Rules for Career Recommendations
  const careerRules = `% Define member/2 predicate
member(X, [X|_]).
member(X, [_|T]) :- member(X, T).

% Define length/2 predicate
length([], 0).
length([_|T], N) :- length(T, N1), N is N1 + 1.

% Define intersection/3 predicate
intersection([], _, []).
intersection([X|Rest1], List2, [X|Rest3]) :-
    member(X, List2),
    intersection(Rest1, List2, Rest3).
intersection([_|Rest1], List2, Rest3) :-
    intersection(Rest1, List2, Rest3).

% Career Profiles (IT careers only)
career('Software Developer', [programming, problem_solving, logic, algorithms, debugging], [computers, software, technology, development]).
career('Web Developer', [programming, web_design, problem_solving, front_end, back_end, javascript, html, css], [web_development, internet, technology, design]).
career('Cybersecurity Analyst', [security, networking, problem_solving, analysis, intrusion_detection, forensics], [network_security, data_security, technology, risk_management]).
career('Network Administrator', [networking, troubleshooting, system_administration, hardware, routing, switching], [networks, servers, infrastructure, protocols]).
career('Database Administrator', [database_management, sql, data_analysis, problem_solving, performance_tuning], [databases, data, information_systems, data_integrity]).
career('Cloud Engineer', [cloud_computing, system_administration, scripting, automation, aws, azure, gcp], [cloud_services, infrastructure, technology, virtualization]).
career('Data Analyst', [data_analysis, statistics, sql, problem_solving, visualization, reporting], [data, business_intelligence, analytics, data_mining]).
career('Data Scientist', [machine_learning, statistics, programming, data_analysis, python, r], [data, ai, machine_learning, modeling]).
career('AI Specialist', [machine_learning, programming, algorithms, problem_solving, deep_learning, neural_networks], [artificial_intelligence, ai, technology, robotics]).
career('IT Project Manager', [project_management, leadership, communication, planning, agile, scrum], [project_management, technology, business, coordination]).
career('UX/UI Designer', [user_interface, user_experience, design, creativity, wireframing, prototyping], [design, web_design, software, usability]).
career('Systems Administrator', [system_administration, troubleshooting, scripting, networking, linux, windows], [servers, operating_systems, infrastructure, maintenance]).
career('DevOps Engineer', [automation, scripting, system_administration, cloud_computing, ci/cd, docker, kubernetes], [software_deployment, infrastructure, cloud, automation]).
career('Information Security Engineer', [security, networking, risk_assessment, cryptography, penetration_testing, vulnerability_analysis], [network_security, information_security, technology, compliance]).
career('Mobile Application Developer', [programming, mobile_development, problem_solving, ui_design, android, ios], [mobile_devices, software, applications, mobile_platforms]).
career('Blockchain Developer', [programming, cryptography, distributed_systems, security, solidity, web3], [blockchain, cryptocurrency, technology, decentralized_applications]).
career('Technical Writer', [documentation, writing, communication, technical_concepts], [documentation, software, hardware, technical_communication]).
career('IT Consultant', [problem_solving, communication, technical_knowledge, business_analysis], [technology, business, consulting, solutions]).
career('Computer Hardware Engineer', [hardware_design, electronics, problem_solving, embedded_systems], [hardware, computers, electronics, circuits]).
career('Computer and Information Research Scientist', [research, algorithms, data_structures, theoretical_computer_science], [research, computers, science, innovation]).

% Recommendation Logic
recommend_career(Career, Interests, Skills) :-
    career(Career, CareerSkills, CareerInterests),
    intersection(Interests, CareerInterests, CommonInterests),
    intersection(Skills, CareerSkills, CommonSkills),
    length(CommonInterests, InterestMatch),
    length(CommonSkills, SkillMatch),
    Score is (2 * SkillMatch) + InterestMatch,
    Score > 1. % Minimum match score`;

  session.consult(careerRules, {
    success: function () {
      // Prolog rules loaded successfully

      // 3. Construct Prolog Query with variables
      let interestsList =
        "[" +
        interests
          .split(",")
          .map((item) => `'${item}'`)
          .join(",") +
        "]";
      let skillsList =
        "[" +
        skills
          .split(",")
          .map((item) => `'${item}'`)
          .join(",") +
        "]";

      const prologQuery = `
            findall(Career, (recommend_career(Career, ${interestsList}, ${skillsList})), Recommendations).
        `;

      // 4. Execute Prolog Query using session.query
      session.query(prologQuery, {
        success: function () {
          // Query executed successfully
          let recommendations = [];
          session.answers((x) => {
            if (x === false) {
              // No more answers
              res.json({ recommendations: recommendations }); // Or handle no results as needed
              // console.log(recommendations)
            } else {
              // Process each answer
              console.log("Answer:", session.format_answer(x)); // Log the raw answer
              recommendations.push(session.format_answer(x));

              try {
                // Extract and parse the Recommendations
                const bindings = x.substitution;
                if (bindings && bindings.Recommendations) {
                  recommendations = pl.fromTerm(bindings.Recommendations);
                }
              } catch (error) {
                console.error("Error processing answer:", error);
                recommendations = [];
              }
              // res.json({ recommendations: recommendations });
            }
          });
        },
        error: function (err) {
          // Query error
          console.error("Prolog query error:", err);
          res.status(500).json({ error: "Prolog query error" });
        },
      });
    },
    error: function (err) {
      // Consult error
      console.error("Prolog consult error:", err);
      res.status(500).json({ error: "Prolog consult error" });
    },
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
