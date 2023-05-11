const express = require("express");
const router = express.Router();

const User = require("../models/User.model");
const Question = require("../models/Question.model");

const bcryptjs = require("bcryptjs");
const saltRounds = 12;
const { isLoggedIn, isLoggedOut } = require("../middlewares/route-guard.js");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


//  (req, res, next) => {
//     console.log(req.session);
//     next();
//   },
//signup
router.get("/signup", isLoggedOut, (req, res, next) => {
    try {
      res.render("auth/signup");
    } catch (err) {
      console.log("you have the following error at signup:", err);
    }
  }
);

//insert middleware here
router.post("/signup",  isLoggedOut, async (req, res, next) => {
  // retreive info from form
  const { email, password } = req.body;

  // check if user already exists
  try {
    const userFromDatabase = await User.findOne({ email });
    if (userFromDatabase) {
      return res.status(400).send("User already exists, go back to previous page");
    }

    const salt = await bcryptjs.genSalt(saltRounds);
    const hash = await bcryptjs.hash(password, salt);

    const user = new User({ email: req.body.email, password: hash });
    await user.save();

    res.redirect("/my-overview");
  } catch (error) {
    next(error);
  }
});

router.get("/my-overview",isLoggedIn, (req, res, next) => {
  res.render("my-overview");
});

router.get("/login",isLoggedOut, (req, res, next) => {
  try {
    res.render("auth/login");
    console.log("successfully rendered login page");
  } catch (err) {
    next(err);
  }
});

router.post("/login", isLoggedOut, async (req, res) => {
  // get info from form
  const { email, password } = req.body;
  console.log("req.body is:", req.body);

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  const userFromDatabase = await User.findOne({ email });
  console.log("user from database: ", userFromDatabase);
  try {
    if (!userFromDatabase) {
      console.log("email or password incorrect");
      res.render("auth/login", { errorMessage: "Email is not registrered, try another email-adress" });
    } else if (bcryptjs.compareSync(password, userFromDatabase.password)) {
      console.log("password correct");
      res.render("my-overview", { userFromDatabase });
    } else {
      console.log("only password incorrect");
      res.render("auth/login", { errorMessage: "Incorrect password." });
    }

    req.session.userFromDatabase = { email: userFromDatabase.email };
    res.redirect("/my-overview");
  } catch (err) {
    console.log("catch from login");
  }
  console.log("SESSION =====> ", req.session);
});


//get question route
router.get('/createQuestion',isLoggedIn, (req, res, next) => {
  try {
    console.log("successfully rendered question page");
    res.render("questions/createQuestion");
    
  } catch (err) {
    console.log('error while geting question page');
  }
});

//Post Question route
router.post("/createQuestion", isLoggedIn, async (req, res, next) => {
  // retreive info from question form
  const { description, correct, false1, false2, false3 } = req.body;
  console.log(req.body);
try{
   const question = new Question({
     description: req.body.description, 
     correct: req.body.correct,
     false1: req.body.false1,
     false2: req.body.false2, 
     false3: req.body.false3 
    });
   await question.save();

   res.redirect("/my-overview");
}
 catch(error){
  console.log('could not post question', error)
 }
});

// View questons get route
router.get('/view-questions', isLoggedIn, (req, res, next) => {

  Question.find()
  .then(questionsFromDb => {
    



    console.log('retrieved questions',questionsFromDb );
    res.render('questions/view-questions', {questions: questionsFromDb});

  })
  .catch(error => {
    console.log('error getting questions', error);
  })
});

router.get('/update/:questionId', isLoggedIn, (req, res, next)=>{
const { questionId } = req.params;
Question.findById(questionId)
   .then(questionToEdit => {
    console.log(questionToEdit);
    res.render('questions/update', { question : questionToEdit})
   })
   .catch(error=>{
    console.log('rendering get /update/:questionId did not work', error)
   });
});

router.post('/update/:questionId', isLoggedIn, (req, res, next)=>{
  const { questionId } = req.params;
  const { description, correct, false1 ,false2 ,false3} = req.body;

  Question.findByIdAndUpdate(
    questionId, { description, correct, false1 ,false2 ,false3 }, {new:true})
    .then (() => res.redirect('/view-questions'))
    .catch(error => console.log('updating went wrong', error));
});

router.post('/update/:questionId/delete', isLoggedIn, (req, res, next) => {
  const { questionId } = req.params;
  console.log('should delete')

  Question.findByIdAndDelete(questionId)
  .then(() => res.redirect('/view-questions'))
  .catch(error => console.log('could not delete question', error));
});



router.get('/play', isLoggedIn, async (req,res,next) => {

try{
 const questionFromDb = await Question.find();
 const randomIndex = Math.floor(Math.random()*questionFromDb.length);
 const randomQuestion = questionFromDb[randomIndex];
 
 const answerArr = [
  randomQuestion.correct,
  randomQuestion.false1,
  randomQuestion.false2,
  randomQuestion.false3
];
// console.log('answers',answerArr);

const answersRandomized = answerArr.sort(()=>
Math.random() - 0.5);
// console.log(answerArr);
// console.log(answersRandomized);
 res.render('questions/play', {randomQuestion, answersRandomized} );

} catch(error){
  console.log('could not get description from db to /play', error);
}
});

router.get('/test/:questionId/:answer', isLoggedIn, async (req,res)=>{
  const {questionId, answer} = req.params;
  console.log('made it');
  try{
    const findQuestion = await Question.findById(questionId);

    if(findQuestion.correct===answer){

      res.redirect('/correct')
    }else{
      res.redirect('/wrong')
    }

  }catch(error){
    console.log(error, 'finding question went wrong');
  }


});

router.get(`/correct`, isLoggedIn,(req,res)=>{

  res.render(`questions/correct`);
});

router.get('/wrong', isLoggedIn, (req,res)=>{
  res.render('questions/wrong');
});

router.post('/logout', isLoggedIn, (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});
 



module.exports = router;
