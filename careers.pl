% Define member/2 predicate
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
    Score > 1. % Minimum match score