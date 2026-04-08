import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const COURSES = [
  {
    id: 1, title: "Complete Web Development Bootcamp",
    instructor: "Sarah Chen", role: "Ex-Meta Engineer", av: "SC",
    duration: "18h", level: "All Levels", price: 49, originalPrice: 99,
    category: "development", rating: 4.9, students: 15420,
    desc: "Master HTML, CSS, JavaScript, React & Node.js from zero to full-stack developer.",
    badge: "Bestseller", skills: ["React","Node.js","CSS","MongoDB"],
    grad: ["#4f46e5","#7c3aed"], emoji: "⚡",
    includes: ["5 modules · 18 hours of video","Hands-on tasks every module","5 quizzes with MCQs","Certificate of completion","Lifetime access"],
    modules: [
      { id:1, title:"Introduction to Web Development", duration:"32 min", ytId:"PlxWf493en4",
        about:"Overview of how the web works, browsers, and setting up your dev environment.",
        task:"Build a simple HTML page with a heading, paragraph, and image.",
        quiz:[{q:"What does HTML stand for?",opts:["Hyper Text Markup Language","High Tech Modern Language","Hyper Transfer Markup Logic","Home Tool Markup Language"],ans:0},{q:"Which tag creates the largest heading?",opts:["<h6>","<heading>","<h1>","<head>"],ans:2},{q:"What does CSS stand for?",opts:["Creative Style Sheets","Cascading Style Sheets","Computer Style Syntax","Coded Style System"],ans:1},{q:"Which language runs in the browser?",opts:["Python","Java","JavaScript","PHP"],ans:2},{q:"What is a web server?",opts:["A fast computer","Software that serves pages","A browser plugin","An HTML element"],ans:1}]},
      { id:2, title:"HTML & CSS Fundamentals", duration:"48 min", ytId:"kUMe1FH4CHE",
        about:"Build your first real webpage with semantic HTML and modern CSS layouts including Flexbox.",
        task:"Create a responsive 2-column layout using Flexbox with nav, main content, and footer.",
        quiz:[{q:"Which CSS property changes text color?",opts:["font-color","text-color","color","foreground"],ans:2},{q:"What is the CSS box model?",opts:["3D rendering technique","Content, padding, border, margin","A flexbox method","A grid system"],ans:1},{q:"Which selector targets id='nav'?",opts:[".nav","#nav","nav","*nav"],ans:1},{q:"How do you make text bold in CSS?",opts:["font-style:bold","text-weight:bold","font-weight:bold","bold:true"],ans:2},{q:"What does display:flex do?",opts:["Hides element","Enables flexbox layout","Makes text italic","Adds animation"],ans:1}]},
      { id:3, title:"JavaScript Essentials", duration:"55 min", ytId:"W6NZfCO5SIk",
        about:"Variables, functions, DOM manipulation, events, and modern async JavaScript patterns.",
        task:"Build a to-do list app using vanilla JS with add, delete, and mark-complete features.",
        quiz:[{q:"Which keyword declares a block-scoped variable?",opts:["var","let","def","dim"],ans:1},{q:"What does '===' check?",opts:["Value only","Type only","Both value and type","Neither"],ans:2},{q:"What is a callback function?",opts:["Calls itself","Passed as an argument","A CSS callback","An HTML event"],ans:1},{q:"What does querySelector return?",opts:["All matching","First matching","Last matching","Element count"],ans:1},{q:"What is a Promise?",opts:["A variable","Object representing async work","A CSS animation","An HTML attribute"],ans:1}]},
      { id:4, title:"React.js Deep Dive", duration:"62 min", ytId:"w7ejDZ8SWv8",
        about:"Components, props, hooks, state management and building real React applications.",
        task:"Build a weather card component in React that accepts city name as prop and displays mock weather data.",
        quiz:[{q:"What is JSX?",opts:["A JS framework","JavaScript XML syntax","A CSS preprocessor","A DB query language"],ans:1},{q:"Which hook manages state?",opts:["useEffect","useRef","useState","useContext"],ans:2},{q:"When does useEffect run?",opts:["On keystrokes","After render","Before render","On mount only"],ans:1},{q:"What are React props?",opts:["State variables","Read-only inputs","CSS classes","Event handlers"],ans:1},{q:"What is Virtual DOM?",opts:["Real browser DOM","Lightweight copy of DOM","CSS rendering engine","JS runtime"],ans:1}]},
      { id:5, title:"Backend with Node.js & MongoDB", duration:"70 min", ytId:"fBNz5xF-Kx4",
        about:"Build a REST API with Express, connect to MongoDB Atlas, and deploy your full-stack app.",
        task:"Create a REST API with Express that has GET, POST, DELETE routes for a notes collection in MongoDB.",
        quiz:[{q:"What is Node.js?",opts:["A browser","JS runtime on server","A CSS framework","A database"],ans:1},{q:"What does Express.js provide?",opts:["A UI framework","Web framework for Node","A database ORM","A bundler"],ans:1},{q:"What type of DB is MongoDB?",opts:["Relational","Graph","NoSQL / Document","Time-series"],ans:2},{q:"What is a REST API?",opts:["A type of CSS","Architectural style for web services","A JS library","A server"],ans:1},{q:"What does 'npm install' do?",opts:["Starts server","Installs dependencies","Creates project","Runs tests"],ans:1}]},
    ]
  },
  {
    id: 2, title: "Data Science & Machine Learning",
    instructor: "Dr. Mia Zhang", role: "ex-OpenAI Researcher", av: "MZ",
    duration: "24h", level: "Advanced", price: 79, originalPrice: 129,
    category: "data-science", rating: 4.9, students: 8750,
    desc: "Python, Pandas, Scikit-learn, TensorFlow and building production-ready ML models.",
    badge: "Top Rated", skills: ["Python","TensorFlow","Pandas","ML"],
    grad: ["#059669","#0284c7"], emoji: "🧠",
    includes: ["5 modules · 24 hours of video","Real ML project tasks","5 quizzes with MCQs","Certificate of completion","Lifetime access"],
    modules: [
      { id:1, title:"Python for Data Science", duration:"50 min", ytId:"ua-CiDNNj30",
        about:"Python basics, NumPy arrays, and Pandas DataFrames for real data manipulation.",
        task:"Load a CSV dataset using Pandas, clean null values, and output summary statistics.",
        quiz:[{q:"What is NumPy primarily used for?",opts:["Web scraping","Numerical computing with arrays","Database queries","ML models"],ans:1},{q:"What is a Pandas DataFrame?",opts:["A list","2D tabular data structure","A neural network","A visualization"],ans:1},{q:"Which function reads a CSV in Pandas?",opts:["pd.load_csv()","pd.open_csv()","pd.read_csv()","pd.import_csv()"],ans:2},{q:"What does df.head() return?",opts:["Last 5 rows","Column names","First 5 rows","Row count"],ans:2},{q:"What is a list comprehension?",opts:["A doc style","Compact way to create lists","A sorting algorithm","A data type"],ans:1}]},
      { id:2, title:"Data Visualization", duration:"44 min", ytId:"a9UrKTVEeZA",
        about:"Matplotlib, Seaborn, and telling compelling data stories through charts.",
        task:"Create 3 different chart types (bar, line, scatter) from a sample dataset using Matplotlib.",
        quiz:[{q:"What library creates static plots?",opts:["NumPy","Pandas","Matplotlib","TensorFlow"],ans:2},{q:"What is Seaborn built on?",opts:["NumPy","Matplotlib","Scikit-learn","Keras"],ans:1},{q:"What chart shows distribution?",opts:["Bar","Pie","Histogram","Line"],ans:2},{q:"What is a heatmap used for?",opts:["Showing temperature","Visualizing correlation matrices","Plotting time series","Showing categories"],ans:1},{q:"What is data storytelling?",opts:["Writing novels","Communicating insights visually","Data entry","DB design"],ans:1}]},
      { id:3, title:"Machine Learning Fundamentals", duration:"65 min", ytId:"aircAruvnKk",
        about:"Supervised & unsupervised learning, model evaluation, and the ML workflow.",
        task:"Train a linear regression model on housing data using scikit-learn. Report MSE and R² score.",
        quiz:[{q:"What is supervised learning?",opts:["Without labels","From labeled data","Reinforcement learning","Transfer learning"],ans:1},{q:"What is overfitting?",opts:["Performs well on test","Memorizes training too well","A neural network type","A regularization technique"],ans:1},{q:"What is cross-validation used for?",opts:["Data cleaning","Evaluating model performance","Feature engineering","Data augmentation"],ans:1},{q:"What does scikit-learn provide?",opts:["Deep learning","ML algorithms and utilities","Database connections","Web frameworks"],ans:1},{q:"What is a confusion matrix?",opts:["A complex equation","Table showing prediction accuracy","A NN layer","A data structure"],ans:1}]},
      { id:4, title:"Neural Networks & Deep Learning", duration:"72 min", ytId:"JMUxmLyrhSk",
        about:"Build and train neural networks from scratch using TensorFlow and Keras.",
        task:"Build a neural network classifier on MNIST digits using Keras. Achieve >95% test accuracy.",
        quiz:[{q:"What is a neural network?",opts:["Social network","Layers inspired by the brain","A database","A web framework"],ans:1},{q:"What is backpropagation?",opts:["A data type","Algorithm for training NNs","A visualization technique","A Python library"],ans:1},{q:"What is an activation function?",opts:["A Python decorator","Introduces non-linearity","A preprocessing step","A loss function"],ans:1},{q:"What is dropout?",opts:["Removing layers","Regularization to prevent overfitting","Data augmentation","An optimizer"],ans:1},{q:"What is Keras built on top of?",opts:["PyTorch","Scikit-learn","TensorFlow","NumPy"],ans:2}]},
      { id:5, title:"Real-World ML Projects & Deployment", duration:"68 min", ytId:"i_LwzRVP7bg",
        about:"End-to-end ML pipeline: feature engineering, model tuning, and deploying with Flask.",
        task:"Deploy your ML model as a REST API using Flask. Test it with Postman and document the endpoints.",
        quiz:[{q:"What is feature engineering?",opts:["Building features from raw data","Training a model","Deploying an app","Writing Python"],ans:0},{q:"What is model deployment?",opts:["Training a model","Making model available for predictions","Cleaning data","Evaluating performance"],ans:1},{q:"What is an API in ML context?",opts:["A dataset","Interface to serve predictions","A NN layer","A preprocessing tool"],ans:1},{q:"What is MLOps?",opts:["A Python library","Practices for deploying ML","A data format","A NN architecture"],ans:1},{q:"What is a data pipeline?",opts:["A Python variable","Automated flow from raw to processed","An ML model","A visualization"],ans:1}]},
    ]
  },
  {
    id: 3, title: "UI/UX Design Fundamentals",
    instructor: "Elena Voss", role: "Principal Designer @ IDEO", av: "EV",
    duration: "6h", level: "Beginner", price: 29, originalPrice: 59,
    category: "design", rating: 4.7, students: 21300,
    desc: "Figma, Wireframing, Prototyping & User Research from scratch — no experience needed.",
    badge: "Popular", skills: ["Figma","Wireframing","UX Research","Prototyping"],
    grad: ["#db2777","#9333ea"], emoji: "🎨",
    includes: ["3 modules · 6 hours of video","Real design tasks in Figma","3 quizzes with MCQs","Certificate of completion","Lifetime access"],
    modules: [
      { id:1, title:"Design Thinking & UX Principles", duration:"38 min", ytId:"_r0VX-aU_T8",
        about:"The 5-stage design thinking process: Empathize, Define, Ideate, Prototype, Test.",
        task:"Write a user persona and map a user journey for a food delivery app.",
        quiz:[{q:"What is the first stage of Design Thinking?",opts:["Define","Ideate","Empathize","Prototype"],ans:2},{q:"What is a user persona?",opts:["A real user","Fictional representation of target user","A wireframe","A prototype"],ans:1},{q:"What is UX design?",opts:["Making things look pretty","Designing user experience holistically","Writing code","Creating logos"],ans:1},{q:"What is a user journey map?",opts:["A site map","Visual of user's experience over time","A wireframe","A database schema"],ans:1},{q:"What is 'empathy' in design?",opts:["Making assumptions","Understanding user needs deeply","Visual styling","Technical implementation"],ans:1}]},
      { id:2, title:"Wireframing & Information Architecture", duration:"42 min", ytId:"qpH7-KFWZRI",
        about:"Low-fidelity wireframes, site maps, and organizing information for usability.",
        task:"Create lo-fi wireframes for a 3-screen mobile app (home, search, profile) in Figma.",
        quiz:[{q:"What is a wireframe?",opts:["A finished design","Low-fidelity layout skeleton","A prototype","A user test"],ans:1},{q:"What is information architecture?",opts:["Physical building structure","Organizing and structuring content","CSS layout","A database design"],ans:1},{q:"What is a sitemap?",opts:["A geographical map","Diagram of website structure","A wireframe","A style guide"],ans:1},{q:"What is a card sort used for?",opts:["Sorting playing cards","Understanding user mental models","Creating prototypes","Writing user stories"],ans:1},{q:"What is a heuristic evaluation?",opts:["A user test","Expert review against usability principles","A wireframe review","An analytics report"],ans:1}]},
      { id:3, title:"Figma & High-Fidelity Prototyping", duration:"55 min", ytId:"FTFaQWZBqQ8",
        about:"Master Figma: components, auto-layout, design systems, and interactive prototypes.",
        task:"Design a complete onboarding flow (3 screens) in Figma with components and prototype links.",
        quiz:[{q:"What is a component in Figma?",opts:["A plugin","Reusable design element","A color style","A font"],ans:1},{q:"What is Auto Layout in Figma?",opts:["Automatic color scheme","Layout that resizes with content","A grid system","An animation tool"],ans:1},{q:"What is a design system?",opts:["An OS","Collection of reusable components & guidelines","A wireframe kit","A project management tool"],ans:1},{q:"What is prototyping?",opts:["Writing code","Creating interactive mockup of design","User testing","Writing documentation"],ans:1},{q:"What is a breakpoint in responsive design?",opts:["An error","Screen width where layout changes","A Figma plugin","A color variable"],ans:1}]},
    ]
  },
  {
    id: 4, title: "Full Stack Java Development",
    instructor: "Vikram Sinha", role: "Full Stack Lead @ Wipro", av: "VS",
    duration: "26h", level: "Intermediate", price: 59, originalPrice: 119,
    category: "development", rating: 4.9, students: 17800,
    desc: "Build complete web apps with Java, Spring Boot, Hibernate, React frontend & MySQL — end to end.",
    badge: "Bestseller", skills: ["Spring Boot","React","MySQL","Hibernate"],
    grad: ["#0f4c81","#1a7431"], emoji: "🚀",
    includes: ["5 modules · 26 hours of video","Real full-stack project every module","5 quizzes with MCQs","Certificate of completion","Lifetime access"],
    modules: [
      { id:1, title:"Java Core Refresher & Maven Setup", duration:"45 min", ytId:"eIrMbAQSU34",
        about:"Quick refresher on Java OOP, generics, collections, lambda expressions, and setting up Maven projects.",
        task:"Create a Maven project with a Student POJO, generic utility class, and a lambda-based grade sorter.",
        quiz:[{q:"What is Maven primarily used for?",opts:["Writing Java code","Build automation and dependency management","Database design","Frontend styling"],ans:1},{q:"What does a lambda expression replace in Java?",opts:["A class","An anonymous inner class / functional interface","A variable","A package"],ans:1},{q:"Which collection maintains insertion order in Java?",opts:["HashSet","HashMap","ArrayList","TreeMap"],ans:2},{q:"What is a generic in Java?",opts:["A random variable","A type-safe parameterized class or method","A static method","A final class"],ans:1},{q:"What does pom.xml contain in a Maven project?",opts:["Java source code","Project dependencies and build config","Database schema","HTML templates"],ans:1}]},
      { id:2, title:"Spring Boot — REST API Development", duration:"60 min", ytId:"9SGDpanrc8U",
        about:"Spring Boot auto-configuration, REST controllers, request mapping, DTOs, validation, and error handling.",
        task:"Build a Student Management REST API with CRUD endpoints (GET, POST, PUT, DELETE) using Spring Boot.",
        quiz:[{q:"What annotation creates a REST controller in Spring Boot?",opts:["@Controller","@Service","@RestController","@Component"],ans:2},{q:"Which annotation maps HTTP GET requests?",opts:["@PostMapping","@GetMapping","@PutMapping","@RequestMapping"],ans:1},{q:"What is a DTO?",opts:["A database table","Data Transfer Object used between layers","A Spring annotation","A test class"],ans:1},{q:"What does @RequestBody do?",opts:["Sends a response","Maps HTTP request body to a Java object","Validates input","Maps URL params"],ans:1},{q:"What is Spring Boot auto-configuration?",opts:["Manual setup of beans","Automatic configuration based on classpath dependencies","A testing tool","A build plugin"],ans:1}]},
      { id:3, title:"Hibernate & Spring Data JPA", duration:"58 min", ytId:"8SGI_XS5OPw",
        about:"ORM concepts, JPA annotations, entity relationships, JPQL queries, and Spring Data repositories.",
        task:"Create Student and Course entities with a ManyToMany relationship. Implement repository methods to enroll and query.",
        quiz:[{q:"What does ORM stand for?",opts:["Object Relational Mapping","Open Resource Manager","Optional Return Method","Object Runtime Model"],ans:0},{q:"Which annotation marks a class as a JPA entity?",opts:["@Table","@Model","@Entity","@Bean"],ans:2},{q:"What is a Spring Data JpaRepository?",opts:["A REST controller","An interface providing CRUD operations for entities","A database driver","A DTO class"],ans:1},{q:"What does @OneToMany represent?",opts:["One database","A relationship where one entity relates to many others","A single column","A primary key"],ans:1},{q:"What is JPQL?",opts:["A JSON query format","Java Persistence Query Language for JPA entities","A Spring annotation","A Maven plugin"],ans:1}]},
      { id:4, title:"React Frontend & Spring Boot Integration", duration:"65 min", ytId:"w7ejDZ8SWv8",
        about:"Build a React frontend with Axios, connect to Spring Boot APIs, handle CORS, JWT auth basics.",
        task:"Build a React Student Dashboard that fetches, creates, updates, and deletes students via your Spring Boot API.",
        quiz:[{q:"Which library is commonly used to make HTTP requests in React?",opts:["jQuery","Fetch only","Axios","XMLHttpRequest"],ans:2},{q:"What is CORS?",opts:["A React hook","Cross-Origin Resource Sharing — controls cross-domain API access","A Spring annotation","A CSS property"],ans:1},{q:"What does JWT stand for?",opts:["Java Web Tool","JSON Web Token","JavaScript Web Transfer","Java Worker Thread"],ans:1},{q:"Which React hook is used for side effects like API calls?",opts:["useState","useRef","useContext","useEffect"],ans:3},{q:"What does the @CrossOrigin annotation do in Spring Boot?",opts:["Validates input","Enables cross-origin requests from specified origins","Maps a route","Handles exceptions"],ans:1}]},
      { id:5, title:"MySQL, Deployment & Full Project", duration:"72 min", ytId:"fBNz5xF-Kx4",
        about:"MySQL schema design, Spring Boot + MySQL config, containerizing with Docker, deploying to cloud.",
        task:"Configure MySQL for your Student API, write schema migrations, Dockerize the app, and deploy it to a free cloud host.",
        quiz:[{q:"Which Spring Boot property sets the database URL?",opts:["db.url","spring.datasource.url","database.connection","jdbc.url"],ans:1},{q:"What is Docker used for?",opts:["Writing Java code","Containerizing and shipping applications","Designing databases","Managing DNS"],ans:1},{q:"What is a database migration tool commonly used with Spring Boot?",opts:["Webpack","Flyway or Liquibase","Maven","Tomcat"],ans:1},{q:"What does @Transactional annotation ensure?",opts:["API security","A method runs within a database transaction","Caching","Input validation"],ans:1},{q:"What is the purpose of application.properties in Spring Boot?",opts:["Store Java classes","Configure app settings like DB, port, logging","Write SQL queries","Define React components"],ans:1}]},
    ]
  },
  {
    id: 5, title: "C Programming — From Zero to Hero",
    instructor: "Raj Kapoor", role: "Systems Engineer @ Intel", av: "RK",
    duration: "14h", level: "Beginner", price: 35, originalPrice: 69,
    category: "development", rating: 4.8, students: 19200,
    desc: "Master C fundamentals — pointers, memory management, data structures and system programming.",
    badge: "Bestseller", skills: ["C","Pointers","Memory","Algorithms"],
    grad: ["#0f766e","#0369a1"], emoji: "🖥️",
    includes: ["5 modules · 14 hours of video","Hands-on coding tasks every module","5 quizzes with MCQs","Certificate of completion","Lifetime access"],
    modules: [
      { id:1, title:"Introduction to C & Setup", duration:"35 min", ytId:"KJgsSFOSQv0",
        about:"History of C, why it matters, installing GCC, writing and compiling your first program.",
        task:"Write a C program that prints your name, age, and a simple arithmetic result. Compile and run it.",
        quiz:[{q:"Who created the C language?",opts:["Linus Torvalds","Dennis Ritchie","Bjarne Stroustrup","James Gosling"],ans:1},{q:"What is the correct file extension for C source files?",opts:[".cpp",".java",".c",".py"],ans:2},{q:"Which function is the entry point of a C program?",opts:["start()","begin()","main()","run()"],ans:2},{q:"What does #include <stdio.h> do?",opts:["Starts the program","Includes standard I/O library","Declares a variable","Defines main"],ans:1},{q:"Which keyword is used to print output in C?",opts:["print","echo","printf","cout"],ans:2}]},
      { id:2, title:"Variables, Data Types & Operators", duration:"42 min", ytId:"e9Eds2Rc_x8",
        about:"Primitive data types, constants, arithmetic & logical operators, type casting.",
        task:"Write a program that takes two numbers and performs all arithmetic operations with proper formatting.",
        quiz:[{q:"Which data type stores a single character in C?",opts:["string","char","letter","byte"],ans:1},{q:"What is the size of int on most 32-bit systems?",opts:["1 byte","2 bytes","4 bytes","8 bytes"],ans:2},{q:"Which operator checks equality in C?",opts:["=","==","===","!="],ans:1},{q:"What does the modulo operator % do?",opts:["Divides two numbers","Returns remainder","Multiplies","Returns quotient"],ans:1},{q:"What is a constant in C declared with?",opts:["var","let","const","#define"],ans:3}]},
      { id:3, title:"Control Flow — Conditions & Loops", duration:"48 min", ytId:"q_F-oOMTURw",
        about:"if/else, switch, for, while, do-while loops with real-world examples.",
        task:"Build a number guessing game using loops and conditionals. Give 5 attempts with hints.",
        quiz:[{q:"Which loop guarantees at least one execution?",opts:["for","while","do-while","foreach"],ans:2},{q:"What does 'break' do in a loop?",opts:["Pauses execution","Exits the loop","Continues to next iteration","Restarts the loop"],ans:1},{q:"Which statement skips the current iteration?",opts:["skip","break","continue","pass"],ans:2},{q:"What is the output of: for(int i=0;i<3;i++) printf('%d',i)?",opts:["123","012","0123","321"],ans:1},{q:"Which keyword is used in switch for default case?",opts:["else","otherwise","default","fallback"],ans:2}]},
      { id:4, title:"Functions, Arrays & Strings", duration:"55 min", ytId:"j4-qNHZuKWo",
        about:"Defining functions, passing arguments, arrays, strings and the string.h library.",
        task:"Write a function that reverses a string without using library functions. Test with 3 different inputs.",
        quiz:[{q:"How do you declare a function in C before using it?",opts:["By calling it","With a prototype","With import","With include"],ans:1},{q:"What is the index of the first element in a C array?",opts:["1","0","-1","undefined"],ans:1},{q:"How do you find string length in C?",opts:["length()","size()","strlen()","str.len"],ans:2},{q:"What does a void function return?",opts:["0","Nothing","Error","Null"],ans:1},{q:"Which character terminates a C string?",opts:["'.'","'#'","'\\0'","'\\n'"],ans:2}]},
      { id:5, title:"Pointers & Memory Management", duration:"62 min", ytId:"2ybLD6_2gKM",
        about:"Pointers, pointer arithmetic, dynamic memory with malloc/free, and avoiding memory leaks.",
        task:"Write a program that dynamically allocates an array of n integers, fills it, prints it, then frees memory.",
        quiz:[{q:"What does a pointer store?",opts:["A value","A memory address","A string","A function"],ans:1},{q:"Which operator gets the address of a variable?",opts:["*","&","->","#"],ans:1},{q:"Which function allocates memory dynamically in C?",opts:["alloc()","new()","malloc()","create()"],ans:2},{q:"Which function releases dynamically allocated memory?",opts:["delete","release","free","clear"],ans:2},{q:"What is a NULL pointer?",opts:["A pointer to zero","A pointer that points to nothing","An invalid pointer","A string pointer"],ans:1}]},
    ]
  },
  {
    id: 6, title: "C++ Programming Masterclass",
    instructor: "Nina Petrov", role: "Senior Engineer @ Microsoft", av: "NP",
    duration: "16h", level: "Intermediate", price: 45, originalPrice: 89,
    category: "development", rating: 4.8, students: 11540,
    desc: "OOP, STL, templates, and modern C++17 features for building high-performance applications.",
    badge: "Top Rated", skills: ["C++","OOP","STL","Templates"],
    grad: ["#7c3aed","#be185d"], emoji: "⚙️",
    includes: ["5 modules · 16 hours of video","Hands-on coding tasks every module","5 quizzes with MCQs","Certificate of completion","Lifetime access"],
    modules: [
      { id:1, title:"C++ Basics & Differences from C", duration:"38 min", ytId:"vLnPwxZdW4Y",
        about:"C++ syntax, cin/cout, namespaces, references, and key differences from C.",
        task:"Write a C++ program that reads user name and age then prints a formatted greeting using cin and cout.",
        quiz:[{q:"Which header is used for input/output in C++?",opts:["<stdio.h>","<iostream>","<input>","<io>"],ans:1},{q:"Which operator is used for output in C++?",opts:["<<",">>","->","=>"],ans:0},{q:"What is 'using namespace std;' for?",opts:["Import a library","Avoid writing std:: prefix","Define a class","Create a namespace"],ans:1},{q:"What is a reference variable in C++?",opts:["A pointer","An alias for another variable","A constant","A new variable"],ans:1},{q:"What does 'endl' do in C++?",opts:["Ends program","Inserts newline and flushes buffer","Ends a loop","Closes file"],ans:1}]},
      { id:2, title:"Object-Oriented Programming", duration:"56 min", ytId:"wN0x9eZLix4",
        about:"Classes, objects, constructors, destructors, access specifiers, and encapsulation.",
        task:"Design a BankAccount class with deposit, withdraw, and getBalance methods. Demonstrate with 3 accounts.",
        quiz:[{q:"What is a class in C++?",opts:["A function","A blueprint for objects","A variable","A loop"],ans:1},{q:"Which access specifier makes members accessible only within the class?",opts:["public","protected","private","internal"],ans:2},{q:"What is a constructor?",opts:["A function that destroys objects","A function called automatically when object is created","A static method","A destructor"],ans:1},{q:"What keyword creates an object dynamically in C++?",opts:["malloc","create","new","alloc"],ans:2},{q:"What is encapsulation?",opts:["Inheriting from a class","Hiding data within a class","Overriding methods","Calling functions"],ans:1}]},
      { id:3, title:"Inheritance & Polymorphism", duration:"52 min", ytId:"j_dYLCmULME",
        about:"Single and multiple inheritance, virtual functions, overriding, and runtime polymorphism.",
        task:"Create an Animal base class and Dog, Cat subclasses. Override the speak() method and demonstrate polymorphism.",
        quiz:[{q:"Which keyword enables inheritance in C++?",opts:["extends","inherits","public (after colon)","from"],ans:2},{q:"What is a virtual function?",opts:["A function that cannot be called","A function overridden in derived class at runtime","A private function","A static function"],ans:1},{q:"What is the purpose of an abstract class?",opts:["To be instantiated directly","To provide a base interface for derived classes","To store data","To replace functions"],ans:1},{q:"What is function overloading?",opts:["Overriding a base method","Multiple functions with same name but different params","A virtual function","An inherited method"],ans:1},{q:"Which operator is commonly overloaded to compare two objects?",opts:["&&","==","||","->"],ans:1}]},
      { id:4, title:"STL — Standard Template Library", duration:"50 min", ytId:"lzqI5I8Yb4A",
        about:"Vectors, maps, sets, iterators, and common STL algorithms like sort and find.",
        task:"Use a vector to store student grades. Sort them, find max, min, and average using STL algorithms.",
        quiz:[{q:"Which STL container stores elements in key-value pairs?",opts:["vector","list","map","set"],ans:2},{q:"What does vector.push_back() do?",opts:["Removes last element","Adds element to the end","Inserts at beginning","Clears the vector"],ans:1},{q:"Which header is required for STL algorithms?",opts:["<stl>","<algorithm>","<vector>","<utility>"],ans:1},{q:"What is an iterator in STL?",opts:["A loop variable","An object to traverse containers","A pointer to heap","A template class"],ans:1},{q:"Which function sorts a vector in C++?",opts:["vector.sort()","std::sort()","array.sort()","list.sort()"],ans:1}]},
      { id:5, title:"Modern C++17 & Best Practices", duration:"58 min", ytId:"9gLyb_syHSI",
        about:"Auto keyword, range-based for loops, smart pointers, lambdas, and move semantics.",
        task:"Refactor a C++ program using auto, range-based for loops, unique_ptr instead of raw pointers, and a lambda.",
        quiz:[{q:"What does the 'auto' keyword do in C++11+?",opts:["Creates automatic variables","Automatically deduces type","Allocates memory","Defines a constant"],ans:1},{q:"What is a smart pointer?",opts:["A fast pointer","A pointer that manages its own memory","A constant pointer","A void pointer"],ans:1},{q:"Which smart pointer allows only one owner?",opts:["shared_ptr","weak_ptr","unique_ptr","raw_ptr"],ans:2},{q:"What is a lambda expression?",opts:["A template function","An anonymous inline function","A class method","A virtual function"],ans:1},{q:"What does std::move() do?",opts:["Copies data","Transfers ownership of resources","Deletes a pointer","Swaps two values"],ans:1}]},
    ]
  },
  {
    id: 7, title: "Python Programming — Complete Beginner to Pro",
    instructor: "Priya Nair", role: "Python Lead @ Flipkart", av: "PN",
    duration: "20h", level: "All Levels", price: 42, originalPrice: 85,
    category: "development", rating: 4.9, students: 28700,
    desc: "Python basics to advanced — OOP, file handling, APIs, automation and real-world projects.",
    badge: "Bestseller", skills: ["Python","OOP","APIs","Automation"],
    grad: ["#1d4ed8","#0891b2"], emoji: "🐍",
    includes: ["5 modules · 20 hours of video","Real-world project tasks","5 quizzes with MCQs","Certificate of completion","Lifetime access"],
    modules: [
      { id:1, title:"Python Basics & Environment Setup", duration:"40 min", ytId:"kqtD5dpn9C8",
        about:"Installing Python, using pip, variables, data types, input/output, and basic operators.",
        task:"Write a Python script that asks user for name and birth year, then calculates and prints their age.",
        quiz:[{q:"What is the correct way to print in Python 3?",opts:["print 'hello'","echo 'hello'","print('hello')","printf('hello')"],ans:2},{q:"Which data type stores True/False in Python?",opts:["bit","boolean","bool","flag"],ans:2},{q:"How do you get user input in Python?",opts:["scanf()","cin >>","input()","readline()"],ans:2},{q:"Which symbol is used for comments in Python?",opts:["//","/*","#","--"],ans:2},{q:"What does len('hello') return?",opts:["4","5","6","Error"],ans:1}]},
      { id:2, title:"Control Flow, Functions & Modules", duration:"48 min", ytId:"DZwmZ8Usvnk",
        about:"if/elif/else, for and while loops, defining functions, args, kwargs, and importing modules.",
        task:"Write a Python function that checks if a number is prime. Test it for numbers 1 to 50.",
        quiz:[{q:"What keyword defines a function in Python?",opts:["function","def","func","define"],ans:1},{q:"How do you import a module in Python?",opts:["#include","require","import","using"],ans:2},{q:"What does *args allow in a function?",opts:["Keyword arguments","Variable positional arguments","Only 2 arguments","No arguments"],ans:1},{q:"Which loop is used when iteration count is unknown?",opts:["for","do-while","while","foreach"],ans:2},{q:"What is the output of range(0,5)?",opts:["0 1 2 3 4 5","0 1 2 3 4","1 2 3 4 5","1 2 3 4"],ans:1}]},
      { id:3, title:"Data Structures — Lists, Dicts, Sets & Tuples", duration:"52 min", ytId:"W8KRzm-HUcc",
        about:"Lists, dictionaries, sets, tuples — creation, manipulation, comprehensions and common methods.",
        task:"Build a Python contact book using a dictionary. Support add, search, delete, and display all contacts.",
        quiz:[{q:"How do you add an element to a list?",opts:["list.add()","list.push()","list.append()","list.insert(0)"],ans:2},{q:"What is a dictionary in Python?",opts:["An ordered list","A key-value store","A set of values","A tuple"],ans:1},{q:"Which data structure does NOT allow duplicates?",opts:["list","tuple","set","dict"],ans:2},{q:"How do you access a dictionary value by key?",opts:["dict.get(key) or dict[key]","dict.find(key)","dict.value(key)","dict.search(key)"],ans:0},{q:"What is a list comprehension?",opts:["A for loop","Compact syntax to create lists","A function","A class method"],ans:1}]},
      { id:4, title:"OOP in Python — Classes & Objects", duration:"55 min", ytId:"JeznW_7DlB0",
        about:"Classes, objects, __init__, inheritance, dunder methods, and Pythonic OOP patterns.",
        task:"Build a Student class with name and grades list. Add methods for average grade and pass/fail status.",
        quiz:[{q:"What is __init__ in Python?",opts:["A destructor","The constructor method","A class variable","A static method"],ans:1},{q:"What does 'self' refer to in a class method?",opts:["The class itself","The current object instance","A global variable","The parent class"],ans:1},{q:"Which keyword is used for inheritance in Python?",opts:["extends","inherits","Pass class in parentheses","using"],ans:2},{q:"What is a dunder method?",opts:["A private method","A method with double underscores like __str__","A static method","A class method"],ans:1},{q:"What does @staticmethod decorator do?",opts:["Makes method private","Creates method not bound to instance","Overrides parent method","Marks method as abstract"],ans:1}]},
      { id:5, title:"File Handling, APIs & Automation", duration:"60 min", ytId:"Uh2ebFW8OO0",
        about:"Reading/writing files, working with JSON, calling REST APIs with requests, and automating tasks.",
        task:"Write a Python script that fetches weather data from a public API, parses JSON, and saves it to a file.",
        quiz:[{q:"How do you open a file for reading in Python?",opts:["open('file','w')","open('file','r')","open('file','a')","open('file','x')"],ans:1},{q:"Which library is used to make HTTP requests in Python?",opts:["urllib only","requests","http","fetch"],ans:1},{q:"What does json.loads() do?",opts:["Saves JSON to file","Parses JSON string to Python dict","Converts dict to JSON","Loads a module"],ans:1},{q:"What does the 'with' statement do when opening files?",opts:["Opens in write mode","Auto-closes the file after block","Locks the file","Reads all lines"],ans:1},{q:"What is web scraping?",opts:["Building a website","Extracting data from web pages programmatically","Sending HTTP requests","Storing data in a database"],ans:1}]},
    ]
  },
  {
    id: 8, title: "Java Programming — Full Course",
    instructor: "Arjun Mehta", role: "Java Architect @ Infosys", av: "AM",
    duration: "22h", level: "Intermediate", price: 48, originalPrice: 95,
    category: "development", rating: 4.7, students: 14900,
    desc: "Core Java, OOP, collections, exception handling, multithreading, and Spring Boot intro.",
    badge: "Popular", skills: ["Java","OOP","Spring","Collections"],
    grad: ["#c2410c","#b45309"], emoji: "☕",
    includes: ["5 modules · 22 hours of video","Real-world coding tasks","5 quizzes with MCQs","Certificate of completion","Lifetime access"],
    modules: [
      { id:1, title:"Java Basics & JVM Architecture", duration:"42 min", ytId:"eIrMbAQSU34",
        about:"How JVM works, installing JDK, writing your first Java program, variables, and data types.",
        task:"Write a Java program that converts temperature from Celsius to Fahrenheit and Kelvin with formatted output.",
        quiz:[{q:"What does JVM stand for?",opts:["Java Virtual Memory","Java Virtual Machine","Java Variable Manager","Java Verified Module"],ans:1},{q:"What is the file extension for compiled Java bytecode?",opts:[".java",".jav",".class",".exe"],ans:2},{q:"Which method is the entry point of a Java program?",opts:["void start()","public static void main(String[] args)","static run()","begin()"],ans:1},{q:"Which data type stores whole numbers in Java?",opts:["float","double","int","char"],ans:2},{q:"What does System.out.println() do?",opts:["Reads input","Prints to console with newline","Opens a file","Exits program"],ans:1}]},
      { id:2, title:"OOP in Java — Classes & Objects", duration:"58 min", ytId:"IIAbOkORmAQ",
        about:"Classes, objects, constructors, this keyword, static members, and object references.",
        task:"Create a Car class with brand, model, speed. Add methods to accelerate and brake. Simulate a race.",
        quiz:[{q:"What is the 'this' keyword in Java?",opts:["Refers to parent class","Refers to current object","A static reference","A constructor"],ans:1},{q:"What are static members in Java?",opts:["Members that belong to objects","Members shared across all instances","Private members","Final members"],ans:1},{q:"What is method overloading?",opts:["Overriding parent method","Multiple methods with same name but different params","A static method","A constructor"],ans:1},{q:"How do you prevent a variable from being changed in Java?",opts:["static","private","final","protected"],ans:2},{q:"What is the default value of an int in Java?",opts:["null","undefined","0","1"],ans:2}]},
      { id:3, title:"Inheritance, Interfaces & Polymorphism", duration:"54 min", ytId:"Zs342eFbXQY",
        about:"Extends, implements, abstract classes, interfaces, and runtime polymorphism in Java.",
        task:"Design a Shape hierarchy: abstract Shape, Circle and Rectangle subclasses. Override area() and print results.",
        quiz:[{q:"Which keyword is used for inheritance in Java?",opts:["implements","inherits","extends","super"],ans:2},{q:"What is an interface in Java?",opts:["A class with methods","A contract with abstract method signatures","A private class","An enum"],ans:1},{q:"Can a Java class extend multiple classes?",opts:["Yes always","No, only single inheritance","Yes with generics","Yes with interfaces"],ans:1},{q:"What is an abstract class?",opts:["A class with no methods","A class that cannot be instantiated directly","A final class","A static class"],ans:1},{q:"What keyword calls the parent class constructor?",opts:["parent()","this()","super()","base()"],ans:2}]},
      { id:4, title:"Collections Framework & Exception Handling", duration:"56 min", ytId:"rzA7UJ-hQoI",
        about:"ArrayList, HashMap, HashSet, iterators, and handling exceptions with try/catch/finally.",
        task:"Build a simple inventory system using HashMap. Add, remove, search items and handle exceptions for invalid inputs.",
        quiz:[{q:"Which collection stores elements in insertion order?",opts:["HashSet","TreeMap","ArrayList","HashMap"],ans:2},{q:"Which collection stores key-value pairs?",opts:["ArrayList","LinkedList","HashMap","HashSet"],ans:2},{q:"What does try-catch do in Java?",opts:["Loops through elements","Handles runtime exceptions","Defines a class","Imports packages"],ans:1},{q:"Which exception is thrown for null reference access?",opts:["IndexOutOfBoundsException","ClassCastException","NullPointerException","IOException"],ans:2},{q:"What does the 'finally' block do?",opts:["Catches exceptions","Runs always after try/catch","Throws an exception","Stops execution"],ans:1}]},
      { id:5, title:"Multithreading & Spring Boot Intro", duration:"65 min", ytId:"mEbEBMIFILI",
        about:"Creating threads, synchronization, concurrency basics, and building your first Spring Boot REST API.",
        task:"Create a multithreaded Java program simulating concurrent bank transactions. Then build a Spring Boot endpoint.",
        quiz:[{q:"How do you create a thread in Java?",opts:["new Process()","Extend Thread or implement Runnable","Use Thread.create()","Using fork()"],ans:1},{q:"What does the 'synchronized' keyword do?",opts:["Speeds up execution","Allows only one thread to access at a time","Pauses a thread","Kills a thread"],ans:1},{q:"What is Spring Boot?",opts:["A Java IDE","A framework for building stand-alone Spring apps","A database","A testing library"],ans:1},{q:"What annotation marks a Spring Boot REST controller?",opts:["@Service","@Component","@RestController","@Repository"],ans:2},{q:"What HTTP method is typically used for creating resources in REST?",opts:["GET","PUT","DELETE","POST"],ans:3}]},
    ]
  },
];

// ─── PAYMENT MODAL ─────────────────────────────────────────────────────────────
function PaymentModal({ course, onClose, onSuccess }) {
  const [method, setMethod] = useState("card");
  const [step, setStep]     = useState("form");
  const [form, setForm]     = useState({ name:"", email:"", card:"", expiry:"", cvv:"", upi:"", nb:"" });
  const [errors, setErrors] = useState({});
  const [processingStep, setProcessingStep] = useState(0);
  const orderId = useRef("WW" + Date.now().toString().slice(-8));

  const discount = Math.round((1 - course.price / course.originalPrice) * 100);
  const gst      = +(course.price * 0.18).toFixed(2);
  const total    = +(course.price + gst).toFixed(2);

  const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp  = v => { const d = v.replace(/\D/g,"").slice(0,4); return d.length>2 ? d.slice(0,2)+"/"+d.slice(2) : d; };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name required";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Valid email required";
    if (method === "card") {
      if (form.card.replace(/\s/g,"").length < 16) e.card   = "Enter valid 16-digit card number";
      if (!form.expiry.match(/^\d{2}\/\d{2}$/))    e.expiry = "Enter expiry MM/YY";
      if (form.cvv.length < 3)                      e.cvv   = "Enter 3-digit CVV";
    }
    if (method === "upi" && !form.upi.match(/^[\w.-]+@[\w]+$/)) e.upi = "Enter valid UPI ID";
    if (method === "nb" && !form.nb) e.nb = "Please select a bank";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setStep("processing");
    setTimeout(() => setProcessingStep(1), 700);
    setTimeout(() => setProcessingStep(2), 1500);
    setTimeout(() => setProcessingStep(3), 2400);
    setTimeout(() => {
      if (form.name.trim()) { try { localStorage.setItem("ww_user_name", form.name.trim()); } catch {} }
      setStep("success");
    }, 3200);
  };

  // Called when user clicks "Start Learning" on success screen
  const handleStartLearning = () => {
    // Pass payment info up so Courses.jsx can record it in wisdomwave_payments
    onSuccess({
      studentName:  form.name.trim(),
      studentEmail: form.email.trim(),
      method:       method,
      maskedCard:   method === "card" ? `**** **** **** ${form.card.replace(/\s/g,"").slice(-4)}` : undefined,
      upiId:        method === "upi" ? form.upi : undefined,
      bank:         method === "nb"  ? form.nb  : undefined,
      totalINR:     Math.round(total * 83),
      orderId:      orderId.current,
    });
  };

  const inp = (f, v) => setForm(p => ({ ...p, [f]: v }));

  return (
    <div className="pay-overlay" onClick={e => e.target.classList.contains("pay-overlay") && step !== "processing" && onClose()}>
      <div className="pay-modal">
        {step === "form" && <>
          <div className="pay-left">
            <div className="pay-course-card" style={{background:`linear-gradient(135deg,${course.grad[0]},${course.grad[1]})`}}>
              <div className="pay-course-grid"/><div className="pay-course-emoji">{course.emoji}</div>
              <div className="pay-course-badge">{course.badge}</div>
            </div>
            <div className="pay-course-info">
              <div className="pay-course-cat">{course.category.replace("-"," ")}</div>
              <div className="pay-course-title">{course.title}</div>
              <div className="pay-course-by">by {course.instructor} · {course.role}</div>
              <div className="pay-course-rating">{"★".repeat(Math.floor(course.rating))} {course.rating} · {course.students.toLocaleString()} students</div>
            </div>
            <div className="pay-divider"/>
            <div className="pay-includes-label">This course includes</div>
            {course.includes.map((inc,i) => (<div key={i} className="pay-include-row"><span className="pay-check-ico">✓</span> {inc}</div>))}
            <div className="pay-divider"/>
            <div className="pay-price-breakdown">
              <div className="pay-price-row"><span>Course price</span><span>₹{(course.price * 83).toLocaleString()}</span></div>
              <div className="pay-price-row discount-row"><span>Discount ({discount}% off)</span><span>–₹{Math.round((course.originalPrice - course.price)*83).toLocaleString()}</span></div>
              <div className="pay-price-row"><span>GST (18%)</span><span>₹{Math.round(gst*83).toLocaleString()}</span></div>
              <div className="pay-divider"/>
              <div className="pay-price-row pay-price-total"><span>Total</span><span>₹{Math.round(total*83).toLocaleString()}</span></div>
            </div>
            <div className="pay-guarantee">🔒 30-day money-back guarantee · Secure SSL payment</div>
          </div>
          <div className="pay-right">
            <button className="pay-close-btn" onClick={onClose}>✕</button>
            <div className="pay-right-title">Complete your enrollment</div>
            <div className="pay-right-sub">You're one step away from starting your learning journey</div>
            <div className="pay-section-label">Personal Details</div>
            <div className="pay-field-row">
              <div className="pay-field">
                <label className="pay-label">Full Name</label>
                <input className={`pay-input ${errors.name?"pay-input-err":""}`} placeholder="Your full name" value={form.name} onChange={e=>inp("name",e.target.value)}/>
                {errors.name && <span className="pay-err">{errors.name}</span>}
              </div>
              <div className="pay-field">
                <label className="pay-label">Email Address</label>
                <input className={`pay-input ${errors.email?"pay-input-err":""}`} placeholder="you@email.com" value={form.email} onChange={e=>inp("email",e.target.value)}/>
                {errors.email && <span className="pay-err">{errors.email}</span>}
              </div>
            </div>
            <div className="pay-section-label" style={{marginTop:20}}>Payment Method</div>
            <div className="pay-method-tabs">
              {[{id:"card",icon:"💳",label:"Credit / Debit Card"},{id:"upi",icon:"📱",label:"UPI"},{id:"nb",icon:"🏦",label:"Net Banking"}].map(m => (
                <button key={m.id} className={`pay-method-tab ${method===m.id?"pay-method-active":""}`} onClick={()=>{setMethod(m.id);setErrors({});}}><span>{m.icon}</span> {m.label}</button>
              ))}
            </div>
            {method === "card" && (
              <div className="pay-card-fields">
                <div className="pay-field" style={{gridColumn:"1/-1"}}>
                  <label className="pay-label">Card Number</label>
                  <div className="pay-card-input-wrap">
                    <input className={`pay-input pay-input-card ${errors.card?"pay-input-err":""}`} placeholder="1234 5678 9012 3456" value={form.card} onChange={e=>inp("card",fmtCard(e.target.value))} maxLength={19}/>
                    <div className="pay-card-brands">
                      <span style={{fontSize:11,fontWeight:800,color:"#1a56db",fontStyle:"italic"}}>VISA</span>
                      <span style={{fontSize:9,fontWeight:800,color:"#eb001b",letterSpacing:"-1px"}}>MC</span>
                      <span style={{fontSize:9,fontWeight:700,color:"#f59e0b"}}>RuPay</span>
                    </div>
                  </div>
                  {errors.card && <span className="pay-err">{errors.card}</span>}
                </div>
                <div className="pay-field">
                  <label className="pay-label">Expiry Date</label>
                  <input className={`pay-input ${errors.expiry?"pay-input-err":""}`} placeholder="MM/YY" value={form.expiry} onChange={e=>inp("expiry",fmtExp(e.target.value))} maxLength={5}/>
                  {errors.expiry && <span className="pay-err">{errors.expiry}</span>}
                </div>
                <div className="pay-field">
                  <label className="pay-label">CVV</label>
                  <input className={`pay-input ${errors.cvv?"pay-input-err":""}`} placeholder="•••" type="password" value={form.cvv} onChange={e=>inp("cvv",e.target.value.replace(/\D/,"").slice(0,3))} maxLength={3}/>
                  {errors.cvv && <span className="pay-err">{errors.cvv}</span>}
                </div>
              </div>
            )}
            {method === "upi" && (
              <div style={{marginTop:12}}>
                <div className="pay-field">
                  <label className="pay-label">UPI ID</label>
                  <input className={`pay-input ${errors.upi?"pay-input-err":""}`} placeholder="yourname@upi" value={form.upi} onChange={e=>inp("upi",e.target.value)}/>
                  {errors.upi && <span className="pay-err">{errors.upi}</span>}
                </div>
                <div className="pay-upi-apps">{["📱 GPay","💙 PhonePe","⚡ Paytm","🏧 BHIM"].map(a=>(<div key={a} className="pay-upi-chip">{a}</div>))}</div>
              </div>
            )}
            {method === "nb" && (
              <div style={{marginTop:12}}>
                <div className="pay-section-label" style={{marginBottom:8}}>Select your bank</div>
                <div className="pay-nb-grid">{["SBI","HDFC","ICICI","Axis","Kotak","Yes Bank"].map(b=>(<button key={b} className={`pay-nb-btn ${form.nb===b?"pay-nb-active":""}`} onClick={()=>inp("nb",b)}>{b}</button>))}</div>
                {errors.nb && <span className="pay-err" style={{marginTop:8,display:"block"}}>{errors.nb}</span>}
              </div>
            )}
            <button className="pay-submit-btn" onClick={handlePay}><span>🔒</span> Pay ₹{Math.round(total*83).toLocaleString()} &amp; Enroll Now</button>
            <div className="pay-terms">By completing your purchase you agree to our <u>Terms of Service</u> &amp; <u>Privacy Policy</u></div>
          </div>
        </>}
        {step === "processing" && (
          <div className="pay-processing">
            <div className="pay-proc-ring"><div className="pay-proc-spinner"/><div className="pay-proc-logo">₹</div></div>
            <div className="pay-proc-title">Processing Payment</div>
            <div className="pay-proc-sub">Please do not close this window</div>
            <div className="pay-proc-steps">
              {["Verifying payment details","Authorizing transaction","Confirming enrollment"].map((s,i) => (
                <div key={i} className={`pay-proc-step ${processingStep>i?"pay-proc-done":processingStep===i?"pay-proc-active":""}`}>
                  <span className="pay-proc-dot">{processingStep>i ? "✓" : processingStep===i ? <span className="pay-proc-pulse">●</span> : "○"}</span>{s}
                </div>
              ))}
            </div>
          </div>
        )}
        {step === "success" && (
          <div className="pay-success">
            <div className="pay-success-circle"><div className="pay-success-check">✓</div></div>
            <div className="pay-success-title">Payment Successful!</div>
            <div className="pay-success-sub">You're now enrolled in</div>
            <div className="pay-success-course">{course.title}</div>
            <div className="pay-success-meta">
              <div className="pay-success-badge">Order ID: {orderId.current}</div>
              <div className="pay-success-badge">₹{Math.round(total*83).toLocaleString()} paid</div>
            </div>
            <div className="pay-success-receipt">
              <div className="pay-receipt-row"><span>Course</span><span>{course.title}</span></div>
              <div className="pay-receipt-row"><span>Instructor</span><span>{course.instructor}</span></div>
              <div className="pay-receipt-row"><span>Modules</span><span>{course.modules.length} modules</span></div>
              <div className="pay-receipt-row"><span>Method</span><span>{method==="card"?"Credit/Debit Card":method==="upi"?"UPI":"Net Banking"}</span></div>
              <div className="pay-receipt-row pay-receipt-total"><span>Total Paid</span><span>₹{Math.round(total*83).toLocaleString()}</span></div>
            </div>
            <div className="pay-success-note">📧 Receipt sent to {form.email || "your email"}</div>
            <button className="pay-start-btn" onClick={handleStartLearning}>🚀 Start Learning Now</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COURSES PAGE ──────────────────────────────────────────────────────────────
export default function Courses() {
  const navigate = useNavigate();
  const [cat, setCat]           = useState("all");
  const [search, setSearch]     = useState("");
  const [payingCourse, setPayingCourse] = useState(null);
  const [certCourse, setCertCourse]     = useState(null);
  const [toast, setToast]       = useState(null);

  const [enrolled, setEnrolled] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ww_en") || "[]"); } catch { return []; }
  });
  const [progress] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ww_prog") || "{}"); } catch { return {}; }
  });

  // ── Admin-added courses ──
  const [adminCourses, setAdminCourses] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wisdomwave_admin_courses") || "[]"); } catch { return []; }
  });

  // ── Third-party approved courses (visible as soon as admin approves) ──
  const [tpCourses, setTpCourses] = useState(() => {
    try {
      const all = JSON.parse(localStorage.getItem("wisdomwave_third_party") || "[]");
      return convertTpCourses(all);
    } catch { return []; }
  });

  // Convert third-party proposals → course shape that Courses page + CoursePlayer expect
  function convertTpCourses(all) {
    return all
      .filter(p => p.status === "approved" && Array.isArray(p.modules) && p.modules.length > 0)
      .map(p => ({
        id:            p.id,
        title:         p.course,
        instructor:    p.company,
        role:          "Partner Course",
        av:            (p.company || "P").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
        duration:      p.duration || "—",
        level:         p.level || "All Levels",
        // price stored as raw INR; divide by 83 so PaymentModal × 83 = correct INR
        price:         Math.round((+p.price) / 83),
        originalPrice: Math.round((+p.price) / 83 * 1.4),
        category:      p.category || "development",
        rating:        4.5,
        students:      p.enrolledStudents || 0,
        desc:          p.description || `${p.course} — a partner course on WisdomWave.`,
        badge:         "Partner",
        skills:        [p.category || "development"],
        grad:          Array.isArray(p.grad) ? p.grad : ["#2563eb", "#7c3aed"],
        emoji:         p.emoji || "🎓",
        includes: [
          `${p.modules.length} modules · ${p.duration || "—"} of video`,
          "Hands-on tasks every module",
          "5 quizzes with MCQs",
          "Certificate of completion",
          "Lifetime access",
        ],
        modules: p.modules,
        partnerCourse: true,
      }));
  }

  useEffect(() => {
    const refresh = () => {
      try {
        const a = localStorage.getItem("wisdomwave_admin_courses");
        if (a) setAdminCourses(JSON.parse(a));
        const t = localStorage.getItem("wisdomwave_third_party");
        if (t) setTpCourses(convertTpCourses(JSON.parse(t)));
      } catch {}
    };
    window.addEventListener("storage", refresh);
    const iv = setInterval(refresh, 3000);
    return () => { window.removeEventListener("storage", refresh); clearInterval(iv); };
  }, []);

  const cats = ["all","development","design","data-science"];
  const badgeStyle = {
    Bestseller:  { bg:"#fef9e7", color:"#b45309", border:"#fde68a" },
    "Top Rated": { bg:"#f0fdf4", color:"#16a34a", border:"#bbf7d0" },
    Popular:     { bg:"#eff6ff", color:"#2563eb", border:"#bfdbfe" },
    Hot:         { bg:"#fff1f2", color:"#e11d48", border:"#fecdd3" },
    Partner:     { bg:"#f5f3ff", color:"#7c3aed", border:"#ddd6fe" },
  };

  const showToast   = (msg, type="info") => { setToast({msg,type}); setTimeout(()=>setToast(null), 3200); };
  const getProgress = id => { const p=progress[id]; if(!p) return 0; return Math.round(p.modules.filter(m=>m.completed).length/p.modules.length*100); };
  const isEnrolled  = id => enrolled.includes(id);
  const isCompleted = id => { const p=progress[id]; if(!p) return false; return p.modules.length>0&&p.modules.every(m=>m.completed); };
  const learnerName = (() => { try { return localStorage.getItem("ww_user_name") || "Learner"; } catch { return "Learner"; } })();

  const handleEnroll = course => {
    if (isCompleted(course.id)) { setCertCourse(course); return; }
    if (isEnrolled(course.id))  { navigate(`/courses/${course.id}/learn`); return; }
    setPayingCourse(course);
  };

  const handlePaymentSuccess = (course, payInfo = {}) => {
    const updated = [...enrolled, course.id];
    setEnrolled(updated);
    localStorage.setItem("ww_en", JSON.stringify(updated));
    const stored = JSON.parse(localStorage.getItem("ww_prog") || "{}");
    // ✅ quizPassed (not passed) — matches CoursePlayer.jsx
    stored[course.id] = { modules: course.modules.map((_,i) => ({ unlocked:i===0, completed:false, quizPassed:false, score:null })) };
    localStorage.setItem("ww_prog", JSON.stringify(stored));

    // ── Record student payment in wisdomwave_payments for Admin Payments tab ──
    try {
      const existing = JSON.parse(localStorage.getItem("wisdomwave_payments") || "[]");
      const studentName = payInfo.studentName || localStorage.getItem("ww_user_name") || "Student";
      const newPayment = {
        txnId:       payInfo.orderId || `STU${Date.now()}`,
        type:        "student_enrollment",
        courseName:  course.title,
        company:     studentName,           // reuse 'company' column for student name
        email:       payInfo.studentEmail || "",
        amount:      payInfo.totalINR      || Math.round(course.price * 83 * 1.18),
        method:      payInfo.method        || "card",
        maskedCard:  payInfo.maskedCard,
        upiId:       payInfo.upiId,
        bank:        payInfo.bank,
        paidAt:      new Date().toISOString(),
        instructor:  course.instructor,
      };
      const updatedPay = [newPayment, ...existing];
      localStorage.setItem("wisdomwave_payments", JSON.stringify(updatedPay));
      window.dispatchEvent(new StorageEvent("storage", { key:"wisdomwave_payments", newValue:JSON.stringify(updatedPay) }));
    } catch {}

    setPayingCourse(null);
    showToast(`🎉 Enrolled in "${course.title}"`, "success");
    navigate(`/courses/${course.id}/learn`);
  };

  // ── Merge all course sources ──
  const allCourses = [...COURSES, ...adminCourses, ...tpCourses];

  const filtered = allCourses.filter(c =>
    (cat==="all" || c.category===cat) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",minHeight:"100vh",background:"#f8f9fc",color:"#111827"}}>
      <style>{CSS}</style>

      <nav className="crs-nav">
        <div className="crs-logo"><div className="crs-logo-mark">📚</div><span>Wisdom<em>Wave</em></span></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:13,color:"#6b7280"}}>Secure payments enabled</span><span style={{fontSize:18}}>🔒</span></div>
      </nav>

      <div className="crs-hero">
        <div className="crs-hero-inner">
          <div className="crs-hero-tag"><span className="crs-hero-dot"/>WisdomWave Curriculum</div>
          <h1 className="crs-h1">Find your next <strong>great skill,</strong><br/><em>start learning today.</em></h1>
          <p className="crs-hero-sub">Expert-led courses with real projects, quizzes, and certificates. Pay once, learn forever.</p>
          <div className="crs-hero-stats">
            <div><div className="crs-stat-n">{allCourses.length}</div><div className="crs-stat-l">Courses</div></div>
            <div className="crs-stat-d"/>
            <div><div className="crs-stat-n">500K+</div><div className="crs-stat-l">Learners</div></div>
            <div className="crs-stat-d"/>
            <div><div className="crs-stat-n">4.8★</div><div className="crs-stat-l">Avg Rating</div></div>
            <div className="crs-stat-d"/>
            <div><div className="crs-stat-n">🔒 SSL</div><div className="crs-stat-l">Secure Pay</div></div>
          </div>
        </div>
        <div className="crs-hero-deco">
          {allCourses.slice(0,4).map((c,i) => (
            <div key={i} className="crs-deco-card" style={{background:`linear-gradient(135deg,${c.grad[0]},${c.grad[1]})`,animationDelay:`${i*0.15}s`}}>
              <span style={{fontSize:32}}>{c.emoji}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="crs-filters">
        <div className="crs-filters-inner">
          <div className="crs-cats">
            {cats.map(c => (
              <button key={c} className={`crs-flt ${cat===c?"crs-flt-on":""}`} onClick={()=>setCat(c)}>
                {c==="all"?"All Courses":c==="data-science"?"Data Science":c.charAt(0).toUpperCase()+c.slice(1)}
              </button>
            ))}
          </div>
          <div className="crs-search">
            <span className="crs-search-ico">🔍</span>
            <input placeholder="Search courses..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>
      </div>

      <div className="crs-grid-wrap">
        <div className="crs-grid">
          {filtered.map((course,idx) => {
            const prog   = getProgress(course.id);
            const isEnr  = isEnrolled(course.id);
            const isDone = isCompleted(course.id);
            const bs     = badgeStyle[course.badge] || {bg:"#f3f4f6",color:"#374151",border:"#e5e7eb"};
            const discount = Math.round((1 - course.price/course.originalPrice)*100);
            return (
              <div key={course.id} className="cc" style={{animationDelay:`${idx*0.06}s`}}>
                <div className="cc-banner" style={{background:`linear-gradient(135deg,${course.grad[0]},${course.grad[1]})`}}>
                  <div className="cc-banner-grid"/>
                  {isDone && <div className="cc-completed-overlay"><div className="cc-completed-seal">🏆</div><div className="cc-completed-text">COMPLETED</div></div>}
                  <div className="cc-banner-emoji" style={{opacity:isDone?0.3:1}}>{course.emoji}</div>
                  <div className="cc-badge" style={{background:bs.bg,color:bs.color,border:`1px solid ${bs.border}`}}>{course.badge}</div>
                  {!isDone && <div className="cc-discount-tag">–{discount}%</div>}
                  {isDone && <div className="cc-completed-tag">✓ Done</div>}
                  {isEnr && <div className="cc-prog-bar"><div className="cc-prog-fill" style={{width:`${isDone?100:prog}%`}}/></div>}
                </div>
                <div className="cc-body">
                  <div className="cc-top">
                    <div className="cc-cat">{course.category.replace("-"," ")}</div>
                    <div style={{textAlign:"right"}}>
                      <div className="cc-price-now">₹{(course.price*83).toLocaleString()}</div>
                      <div className="cc-price-was">₹{(course.originalPrice*83).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="cc-title">{course.title}</div>
                  <div className="cc-desc">{course.desc}</div>
                  <div className="cc-skills">{course.skills.map((s,i)=><span key={i} className="cc-skill">{s}</span>)}</div>
                  <div className="cc-meta">
                    <span>🎬 {course.modules.length} modules</span>
                    <span>⏱ {course.duration}</span>
                    <span>👥 {course.students.toLocaleString()}</span>
                    <span>📶 {course.level}</span>
                  </div>
                  <div className="cc-instr"><div className="cc-av">{course.av}</div><span>{course.instructor} · {course.role}</span></div>
                  <div className="cc-foot">
                    <div>
                      <div className="cc-stars">{"★".repeat(Math.floor(course.rating))}<span className="cc-star-off">{"★".repeat(5-Math.floor(course.rating))}</span></div>
                      <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{course.rating} rating</div>
                      {isEnr && !isDone && prog>0 && <div style={{fontSize:11,color:"#2563eb",fontWeight:700,marginTop:2}}>{prog}% complete</div>}
                      {isDone && <div style={{fontSize:11,color:"#16a34a",fontWeight:700,marginTop:2}}>✓ Course Completed!</div>}
                    </div>
                    {isDone
                      ? <button className="cc-cert-btn" onClick={()=>setCertCourse(course)}>🏆 View Certificate</button>
                      : <button className={`cc-enroll ${isEnr?"cc-enroll-done":"cc-enroll-idle"}`} onClick={()=>handleEnroll(course)}>
                          {isEnr ? "▶ Continue" : `🔒 Enroll · ₹${(course.price*83).toLocaleString()}`}
                        </button>
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {payingCourse && <PaymentModal course={payingCourse} onClose={()=>setPayingCourse(null)} onSuccess={(payInfo)=>handlePaymentSuccess(payingCourse, payInfo)}/>}
      {toast && <div className={`ww-toast ${toast.type}`}>{toast.msg}</div>}

      {/* CERTIFICATE MODAL */}
      {certCourse && (
        <div className="cert-overlay" onClick={()=>setCertCourse(null)}>
          <div className="cert-modal" onClick={e=>e.stopPropagation()}>
            <div className="cert-content">
              <div className="cert-watermark">🏆</div>
              <div className="cert-header-band"/>
              <div className="cert-logo-row">
                <div className="cert-logo-icon">📚</div>
                <div className="cert-logo-name">Wisdom<em>Wave</em></div>
              </div>
              <div className="cert-subtitle">CERTIFICATE OF COMPLETION</div>
              <div className="cert-divider-line"/>
              <div className="cert-presented">This certificate is proudly presented to</div>
              <div className="cert-name">{learnerName}</div>
              <div className="cert-for">for successfully completing the course</div>
              <div className="cert-course-title">{certCourse.title}</div>
              <div className="cert-meta-row">
                <div className="cert-meta-item"><span className="cert-meta-label">Instructor</span><span className="cert-meta-val">{certCourse.instructor}</span></div>
                <div className="cert-meta-sep"/>
                <div className="cert-meta-item"><span className="cert-meta-label">Modules</span><span className="cert-meta-val">{certCourse.modules.length} modules</span></div>
                <div className="cert-meta-sep"/>
                <div className="cert-meta-item"><span className="cert-meta-label">Duration</span><span className="cert-meta-val">{certCourse.duration}</span></div>
                <div className="cert-meta-sep"/>
                <div className="cert-meta-item"><span className="cert-meta-label">Date</span><span className="cert-meta-val">{new Date().toLocaleDateString("en-IN",{year:"numeric",month:"short",day:"numeric"})}</span></div>
              </div>
              <div className="cert-stars-row">⭐⭐⭐⭐⭐</div>
              <div className="cert-sig-row">
                <div className="cert-sig"><div className="cert-sig-line"/><div className="cert-sig-label">{certCourse.instructor}</div><div className="cert-sig-sub">Course Instructor</div></div>
                <div className="cert-seal"><div className="cert-seal-inner">✓<br/><span style={{fontSize:8,letterSpacing:1}}>VERIFIED</span></div></div>
                <div className="cert-sig"><div className="cert-sig-line"/><div className="cert-sig-label">WisdomWave</div><div className="cert-sig-sub">Learning Platform</div></div>
              </div>
              <div className="cert-footer-band"/>
            </div>
            <div className="cert-actions">
              <button className="cert-close-btn" onClick={()=>setCertCourse(null)}>✕ Close</button>
              <div style={{display:"flex",gap:10}}>
                <button className="cert-share-btn" onClick={()=>{navigator.clipboard?.writeText(`I just completed "${certCourse.title}" on WisdomWave! 🎓`); showToast("📋 Copied to clipboard!","success");}}>📤 Share</button>
                <button className="cert-download-btn" onClick={()=>window.print()}>⬇ Download Certificate</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#f8f9fc;--bg2:#ffffff;--surf:#ffffff;--surf2:#f3f4f6;--surf3:#e5e7eb;
  --bdr:#e5e7eb;--bdr2:#d1d5db;--txt:#111827;--txt2:#4b5563;--txt3:#9ca3af;
  --acc:#2563eb;--acc-d:rgba(37,99,235,0.08);--acc-g:rgba(37,99,235,0.18);
  --grn:#16a34a;--grn-d:rgba(22,163,74,0.1);--amb:#d97706;--red:#dc2626;--gold:#b45309;
  --shadow-sm:0 1px 3px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.05);
  --shadow-md:0 4px 16px rgba(0,0,0,0.08),0 2px 6px rgba(0,0,0,0.05);
  --shadow-lg:0 12px 40px rgba(0,0,0,0.1),0 4px 12px rgba(0,0,0,0.06);
}
button{font-family:'DM Sans',sans-serif;cursor:pointer;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:var(--surf3);border-radius:10px;}
.ww-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);z-index:9999;padding:13px 24px;border-radius:100px;font-size:14px;font-weight:600;white-space:nowrap;box-shadow:var(--shadow-lg);animation:toastIn .3s ease;}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(12px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
.ww-toast.success{background:var(--grn);color:white;}.ww-toast.error{background:var(--red);color:white;}.ww-toast.info{background:var(--txt);color:white;}
.crs-nav{height:64px;background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;padding:0 48px;position:sticky;top:0;z-index:50;box-shadow:var(--shadow-sm);}
.crs-logo{display:flex;align-items:center;gap:10px;font-family:'Fraunces',serif;font-size:20px;font-weight:700;color:var(--txt);}
.crs-logo-mark{width:34px;height:34px;background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px;}
.crs-logo em{color:var(--acc);font-style:normal;}
.crs-hero{padding:64px 48px 56px;background:linear-gradient(160deg,#ffffff 0%,#eef2ff 50%,#f0fdf4 100%);border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;gap:40px;position:relative;overflow:hidden;}
.crs-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 600px 400px at 70% 50%,rgba(99,102,241,0.06) 0%,transparent 70%);pointer-events:none;}
.crs-hero-inner{flex:1;max-width:600px;}
.crs-hero-deco{display:flex;flex-direction:column;gap:12px;flex-shrink:0;}
.crs-deco-card{width:72px;height:72px;border-radius:18px;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-md);animation:floatUp .5s ease both;transition:transform .3s;}
.crs-deco-card:hover{transform:scale(1.08) rotate(-3deg);}
@keyframes floatUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
.crs-hero-tag{display:inline-flex;align-items:center;gap:7px;padding:5px 14px;border-radius:100px;background:var(--acc-d);border:1px solid var(--acc-g);font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--acc);margin-bottom:18px;}
.crs-hero-dot{width:6px;height:6px;border-radius:50%;background:var(--acc);animation:pulse 2s ease infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}
.crs-h1{font-family:'Fraunces',serif;font-size:52px;font-weight:300;color:var(--txt);line-height:1.05;letter-spacing:-1.5px;margin-bottom:14px;}
.crs-h1 strong{font-weight:700;}.crs-h1 em{font-style:italic;color:var(--acc);}
.crs-hero-sub{font-size:17px;color:var(--txt2);max-width:480px;line-height:1.7;margin-bottom:32px;}
.crs-hero-stats{display:flex;gap:36px;align-items:center;}
.crs-stat-n{font-family:'Fraunces',serif;font-size:28px;font-weight:700;color:var(--txt);}
.crs-stat-l{font-size:12px;color:var(--txt3);text-transform:uppercase;letter-spacing:.8px;}
.crs-stat-d{width:1px;background:var(--bdr2);align-self:stretch;}
.crs-filters{background:var(--bg2);border-bottom:1px solid var(--bdr);padding:0 48px;box-shadow:var(--shadow-sm);}
.crs-filters-inner{display:flex;align-items:center;gap:8px;height:58px;flex-wrap:wrap;}
.crs-cats{display:flex;gap:4px;}
.crs-flt{padding:7px 18px;border-radius:100px;border:1.5px solid transparent;background:transparent;font-size:13px;font-weight:500;color:var(--txt2);transition:all .18s;}
.crs-flt:hover{background:var(--surf2);color:var(--txt);border-color:var(--bdr);}
.crs-flt-on{background:var(--acc);border-color:var(--acc);color:white;font-weight:600;box-shadow:0 2px 8px rgba(37,99,235,0.25);}
.crs-search{position:relative;margin-left:auto;}
.crs-search-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;font-size:13px;}
.crs-search input{padding:9px 14px 9px 34px;background:var(--surf2);border:1.5px solid var(--bdr);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--txt);outline:none;transition:all .2s;width:220px;}
.crs-search input::placeholder{color:var(--txt3);}
.crs-search input:focus{border-color:var(--acc);box-shadow:0 0 0 3px var(--acc-d);background:white;}
.crs-grid-wrap{padding:32px 48px 48px;}
.crs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(295px,1fr));gap:20px;max-width:1400px;margin:0 auto;}
.cc{background:var(--bg2);border:1.5px solid var(--bdr);border-radius:18px;overflow:hidden;transition:all .3s;animation:cardUp .4s ease both;box-shadow:var(--shadow-sm);}
@keyframes cardUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
.cc:hover{border-color:var(--bdr2);transform:translateY(-5px);box-shadow:var(--shadow-lg);}
.cc-banner{height:140px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.cc-banner-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:22px 22px;}
.cc-banner-emoji{font-size:52px;position:relative;z-index:1;transition:all .3s;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.15));}
.cc:hover .cc-banner-emoji{transform:scale(1.1) rotate(-4deg);}
.cc-badge{position:absolute;top:12px;left:12px;padding:4px 10px;border-radius:100px;font-size:10px;font-weight:700;}
.cc-discount-tag{position:absolute;top:12px;right:12px;padding:4px 10px;border-radius:100px;background:rgba(22,163,74,0.9);color:white;font-size:11px;font-weight:800;}
.cc-prog-bar{position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(255,255,255,0.3);}
.cc-prog-fill{height:100%;background:rgba(255,255,255,0.9);transition:width .6s ease;}
.cc-body{padding:18px;}
.cc-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;}
.cc-cat{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--acc);}
.cc-price-now{font-family:'Fraunces',serif;font-size:20px;font-weight:700;color:var(--txt);line-height:1;}
.cc-price-was{font-size:11px;color:var(--txt3);text-decoration:line-through;text-align:right;}
.cc-title{font-size:15px;font-weight:700;color:var(--txt);line-height:1.35;margin-bottom:5px;}
.cc-desc{font-size:13px;color:var(--txt2);line-height:1.55;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.cc-skills{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:11px;}
.cc-skill{padding:3px 9px;border-radius:6px;background:var(--surf2);border:1px solid var(--bdr);font-size:11px;font-weight:600;color:var(--txt2);}
.cc-meta{display:flex;gap:10px;font-size:12px;color:var(--txt3);margin-bottom:11px;flex-wrap:wrap;}
.cc-instr{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--txt2);margin-bottom:13px;}
.cc-av{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:white;background:linear-gradient(135deg,var(--acc),#7c3aed);flex-shrink:0;}
.cc-foot{display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid var(--bdr);}
.cc-stars{font-size:13px;color:var(--amb);letter-spacing:1px;}
.cc-star-off{color:var(--surf3);}
.cc-enroll{padding:9px 16px;border-radius:100px;border:none;font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px;transition:all .25s;white-space:nowrap;}
.cc-enroll-idle{background:linear-gradient(135deg,#16a34a,#15803d);color:white;box-shadow:0 2px 10px rgba(22,163,74,0.3);}
.cc-enroll-idle:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(22,163,74,0.4);}
.cc-enroll-done{background:var(--acc-d);color:var(--acc);border:1.5px solid var(--acc-g);}
.cc-enroll-done:hover{background:rgba(37,99,235,0.12);}
.cc-cert-btn{padding:9px 16px;border-radius:100px;border:none;font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px;transition:all .25px;white-space:nowrap;background:linear-gradient(135deg,#b45309,#d97706);color:white;box-shadow:0 2px 10px rgba(180,83,9,0.35);cursor:pointer;}
.cc-cert-btn:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(180,83,9,0.45);}
.cc-completed-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.45);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;z-index:2;}
.cc-completed-seal{font-size:40px;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.4));}
.cc-completed-text{font-size:11px;font-weight:800;letter-spacing:3px;color:white;text-transform:uppercase;}
.cc-completed-tag{position:absolute;top:12px;right:12px;padding:4px 10px;border-radius:100px;background:rgba(22,163,74,0.95);color:white;font-size:11px;font-weight:800;}
.pay-overlay{position:fixed;inset:0;background:rgba(17,24,39,0.5);backdrop-filter:blur(8px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;animation:fadeI .2s ease;}
@keyframes fadeI{from{opacity:0;}to{opacity:1;}}
.pay-modal{background:var(--bg2);border:1.5px solid var(--bdr);border-radius:24px;overflow:hidden;display:flex;max-width:900px;width:100%;max-height:90vh;animation:slideU .3s ease;position:relative;box-shadow:0 24px 80px rgba(0,0,0,0.15);}
@keyframes slideU{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
.pay-left{width:300px;min-width:300px;background:#f8f9fc;border-right:1.5px solid var(--bdr);padding:24px;overflow-y:auto;display:flex;flex-direction:column;}
.pay-course-card{height:100px;border-radius:14px;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;margin-bottom:16px;flex-shrink:0;}
.pay-course-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:20px 20px;}
.pay-course-emoji{font-size:40px;position:relative;z-index:1;}
.pay-course-badge{position:absolute;top:10px;left:10px;padding:3px 10px;border-radius:100px;background:rgba(255,255,255,0.2);backdrop-filter:blur(6px);font-size:10px;font-weight:700;color:white;}
.pay-course-info{margin-bottom:16px;}
.pay-course-cat{font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--acc);margin-bottom:4px;}
.pay-course-title{font-family:'Fraunces',serif;font-size:16px;font-weight:700;color:var(--txt);line-height:1.3;margin-bottom:4px;}
.pay-course-by{font-size:12px;color:var(--txt2);margin-bottom:4px;}
.pay-course-rating{font-size:12px;color:var(--amb);font-weight:600;}
.pay-divider{height:1px;background:var(--bdr);margin:14px 0;}
.pay-includes-label{font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--txt3);margin-bottom:10px;}
.pay-include-row{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:var(--txt2);margin-bottom:8px;line-height:1.4;}
.pay-check-ico{color:var(--grn);font-weight:800;flex-shrink:0;}
.pay-price-breakdown{display:flex;flex-direction:column;gap:8px;}
.pay-price-row{display:flex;justify-content:space-between;font-size:13px;color:var(--txt2);}
.discount-row{color:var(--grn);}
.pay-price-total{font-size:16px;font-weight:800;color:var(--txt);padding-top:10px;}
.pay-guarantee{font-size:11px;color:var(--txt3);margin-top:14px;text-align:center;line-height:1.5;}
.pay-right{flex:1;padding:28px 28px 24px;overflow-y:auto;position:relative;background:white;}
.pay-close-btn{position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:50%;background:var(--surf2);border:1.5px solid var(--bdr);color:var(--txt2);font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .2s;}
.pay-close-btn:hover{border-color:var(--red);color:var(--red);}
.pay-right-title{font-family:'Fraunces',serif;font-size:24px;font-weight:700;color:var(--txt);margin-bottom:4px;padding-right:40px;}
.pay-right-sub{font-size:13px;color:var(--txt2);margin-bottom:20px;}
.pay-section-label{font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--txt3);margin-bottom:10px;}
.pay-field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:4px;}
.pay-field{display:flex;flex-direction:column;gap:5px;}
.pay-label{font-size:12px;font-weight:600;color:var(--txt2);}
.pay-input{padding:10px 14px;background:var(--surf2);border:1.5px solid var(--bdr);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--txt);outline:none;transition:all .2s;width:100%;}
.pay-input::placeholder{color:var(--txt3);}
.pay-input:focus{border-color:var(--acc);box-shadow:0 0 0 3px var(--acc-d);background:white;}
.pay-input-err{border-color:var(--red) !important;}
.pay-err{font-size:11px;color:var(--red);font-weight:600;}
.pay-method-tabs{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;}
.pay-method-tab{display:flex;align-items:center;gap:7px;padding:9px 14px;border-radius:10px;border:1.5px solid var(--bdr);background:var(--surf2);color:var(--txt2);font-size:13px;font-weight:500;transition:all .2s;}
.pay-method-tab:hover{border-color:var(--bdr2);color:var(--txt);}
.pay-method-active{border-color:var(--acc) !important;background:var(--acc-d) !important;color:var(--acc) !important;font-weight:700 !important;}
.pay-card-fields{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.pay-card-input-wrap{position:relative;}
.pay-input-card{padding-right:90px;}
.pay-card-brands{position:absolute;right:12px;top:50%;transform:translateY(-50%);display:flex;gap:5px;align-items:center;}
.pay-upi-apps{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;}
.pay-upi-chip{padding:6px 14px;border-radius:100px;background:var(--surf2);border:1px solid var(--bdr);font-size:12px;color:var(--txt2);}
.pay-nb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.pay-nb-btn{padding:9px;border-radius:10px;border:1.5px solid var(--bdr);background:var(--surf2);color:var(--txt2);font-size:13px;font-weight:600;transition:all .2s;}
.pay-nb-btn:hover{border-color:var(--bdr2);color:var(--txt);}
.pay-nb-active{border-color:var(--acc) !important;background:var(--acc-d) !important;color:var(--acc) !important;}
.pay-submit-btn{width:100%;margin-top:20px;padding:14px;background:linear-gradient(135deg,#16a34a,#15803d);border:none;border-radius:12px;color:white;font-size:15px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .25s;box-shadow:0 4px 16px rgba(22,163,74,0.3);}
.pay-submit-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(22,163,74,0.4);}
.pay-terms{font-size:11px;color:var(--txt3);text-align:center;margin-top:12px;line-height:1.6;}
.pay-terms u{cursor:pointer;color:var(--txt2);}
.pay-processing{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;padding:60px 40px;text-align:center;}
.pay-proc-ring{width:90px;height:90px;position:relative;margin-bottom:28px;}
.pay-proc-spinner{position:absolute;inset:0;border-radius:50%;border:3px solid var(--bdr);border-top-color:var(--acc);animation:spin .9s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.pay-proc-logo{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:var(--acc);font-family:'Fraunces',serif;}
.pay-proc-title{font-family:'Fraunces',serif;font-size:24px;font-weight:700;color:var(--txt);margin-bottom:6px;}
.pay-proc-sub{font-size:14px;color:var(--txt2);margin-bottom:28px;}
.pay-proc-steps{display:flex;flex-direction:column;gap:14px;width:100%;max-width:300px;}
.pay-proc-step{display:flex;align-items:center;gap:12px;font-size:14px;color:var(--txt3);transition:all .3s;}
.pay-proc-dot{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;}
.pay-proc-active{color:var(--txt);}.pay-proc-active .pay-proc-dot{background:var(--acc-d);color:var(--acc);}
.pay-proc-done{color:var(--grn);}.pay-proc-done .pay-proc-dot{background:var(--grn-d);color:var(--grn);}
.pay-proc-pulse{animation:blink .8s ease infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.2;}}
.pay-success{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;padding:40px;text-align:center;overflow-y:auto;}
.pay-success-circle{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--grn),#15803d);display:flex;align-items:center;justify-content:center;margin-bottom:20px;animation:popIn .4s cubic-bezier(.175,.885,.32,1.275) both;box-shadow:0 8px 28px rgba(22,163,74,0.3);}
@keyframes popIn{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
.pay-success-check{font-size:36px;color:white;font-weight:800;}
.pay-success-title{font-family:'Fraunces',serif;font-size:28px;font-weight:700;color:var(--txt);margin-bottom:4px;}
.pay-success-sub{font-size:14px;color:var(--txt2);margin-bottom:6px;}
.pay-success-course{font-family:'Fraunces',serif;font-size:18px;font-weight:600;color:var(--acc);margin-bottom:16px;max-width:380px;line-height:1.3;}
.pay-success-meta{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:20px;}
.pay-success-badge{padding:5px 14px;border-radius:100px;background:var(--surf2);border:1px solid var(--bdr);font-size:12px;color:var(--txt2);}
.pay-success-receipt{background:var(--surf2);border:1.5px solid var(--bdr);border-radius:14px;padding:16px;width:100%;max-width:380px;margin-bottom:16px;}
.pay-receipt-row{display:flex;justify-content:space-between;font-size:13px;color:var(--txt2);padding:6px 0;border-bottom:1px solid var(--bdr);}
.pay-receipt-row:last-child{border-bottom:none;}
.pay-receipt-row span:last-child{color:var(--txt);font-weight:600;}
.pay-receipt-total{font-size:15px;font-weight:800;}.pay-receipt-total span{color:var(--grn) !important;}
.pay-success-note{font-size:12px;color:var(--txt3);margin-bottom:20px;}
.pay-start-btn{padding:14px 40px;background:linear-gradient(135deg,var(--acc),#1d4ed8);border:none;border-radius:100px;color:white;font-size:15px;font-weight:800;transition:all .25s;box-shadow:0 6px 20px rgba(37,99,235,0.3);}
.pay-start-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(37,99,235,0.4);}
.cert-overlay{position:fixed;inset:0;background:rgba(17,24,39,0.65);backdrop-filter:blur(10px);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeI .25s ease;}
.cert-modal{background:white;border-radius:20px;overflow:hidden;max-width:720px;width:100%;box-shadow:0 32px 80px rgba(0,0,0,0.25);animation:slideU .3s ease;display:flex;flex-direction:column;}
.cert-content{position:relative;overflow:hidden;background:linear-gradient(160deg,#fffbf0,#fff8e1 40%,#fef3c7);}
.cert-watermark{position:absolute;font-size:220px;opacity:0.04;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;line-height:1;}
.cert-header-band{height:8px;background:linear-gradient(90deg,#b45309,#d97706,#f59e0b,#d97706,#b45309);}
.cert-footer-band{height:6px;background:linear-gradient(90deg,#b45309,#d97706,#f59e0b,#d97706,#b45309);}
.cert-logo-row{display:flex;align-items:center;justify-content:center;gap:10px;padding:28px 40px 0;}
.cert-logo-icon{font-size:28px;}
.cert-logo-name{font-family:'Fraunces',serif;font-size:22px;font-weight:700;color:#111827;}
.cert-logo-name em{color:#b45309;font-style:normal;}
.cert-subtitle{text-align:center;font-size:11px;font-weight:800;letter-spacing:4px;color:#b45309;text-transform:uppercase;margin-top:4px;}
.cert-divider-line{width:80px;height:2px;background:linear-gradient(90deg,transparent,#d97706,transparent);margin:18px auto;}
.cert-presented{text-align:center;font-size:13px;color:#6b7280;letter-spacing:1px;margin-bottom:10px;}
.cert-name{font-family:'Fraunces',serif;font-size:40px;font-weight:700;color:#111827;text-align:center;line-height:1.1;margin-bottom:12px;padding:0 40px;}
.cert-for{text-align:center;font-size:13px;color:#6b7280;letter-spacing:1px;margin-bottom:10px;}
.cert-course-title{font-family:'Fraunces',serif;font-size:22px;font-weight:600;color:#b45309;text-align:center;line-height:1.3;padding:0 40px;margin-bottom:22px;}
.cert-meta-row{display:flex;align-items:center;justify-content:center;margin:0 40px 20px;background:rgba(180,83,9,0.06);border:1px solid rgba(180,83,9,0.15);border-radius:12px;padding:14px 20px;flex-wrap:wrap;}
.cert-meta-item{display:flex;flex-direction:column;align-items:center;gap:3px;padding:0 18px;}
.cert-meta-label{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;}
.cert-meta-val{font-size:13px;font-weight:700;color:#111827;}
.cert-meta-sep{width:1px;height:36px;background:rgba(180,83,9,0.2);}
.cert-stars-row{text-align:center;font-size:18px;letter-spacing:4px;margin-bottom:22px;}
.cert-sig-row{display:flex;align-items:flex-end;justify-content:space-between;padding:0 48px 28px;gap:20px;}
.cert-sig{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;}
.cert-sig-line{width:100%;max-width:130px;height:1.5px;background:#d1d5db;}
.cert-sig-label{font-size:12px;font-weight:700;color:#374151;text-align:center;}
.cert-sig-sub{font-size:10px;color:#9ca3af;text-align:center;}
.cert-seal{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#b45309,#d97706);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(180,83,9,0.35);flex-shrink:0;}
.cert-seal-inner{text-align:center;color:white;font-size:22px;font-weight:800;line-height:1.2;}
.cert-actions{padding:16px 24px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;background:white;}
.cert-close-btn{padding:9px 18px;background:transparent;border:1.5px solid #e5e7eb;border-radius:100px;color:#6b7280;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;}
.cert-close-btn:hover{border-color:#dc2626;color:#dc2626;}
.cert-download-btn{padding:10px 22px;background:linear-gradient(135deg,#b45309,#d97706);border:none;border-radius:100px;color:white;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 3px 12px rgba(180,83,9,0.3);}
.cert-download-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(180,83,9,0.4);}
.cert-share-btn{padding:10px 22px;background:var(--surf2);border:1.5px solid var(--bdr);border-radius:100px;color:var(--txt2);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;}
.cert-share-btn:hover{border-color:var(--acc);color:var(--acc);}
@media print{body *{visibility:hidden;}.cert-content,.cert-content *{visibility:visible;}.cert-content{position:fixed;inset:0;width:100%;height:100%;}.cert-overlay{background:none;}.cert-actions{display:none;}}
@media(max-width:768px){
  .pay-modal{flex-direction:column;max-height:95vh;}
  .pay-left{width:100%;min-width:0;border-right:none;border-bottom:1.5px solid var(--bdr);padding:16px;}
  .crs-h1{font-size:34px;}
  .crs-hero{padding:36px 20px 28px;flex-direction:column;}
  .crs-hero-deco{flex-direction:row;}
  .crs-filters,.crs-grid-wrap{padding-left:16px;padding-right:16px;}
  .crs-nav{padding:0 20px;}
  .pay-field-row,.pay-card-fields{grid-template-columns:1fr;}
  .cert-name{font-size:28px;}
  .cert-sig-row{padding:0 24px 20px;}
  .cert-meta-sep{display:none;}
}
`;
