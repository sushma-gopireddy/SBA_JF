// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

function getLearnerDataSample(course, ag, submissions) {
  // here, we would process this data to achieve the desired result.
  const result = [
    {
      id: 125,
      avg: 0.985, // (47 + 150) / (50 + 150)
      1: 0.94, // 47 / 50
      2: 1.0 // 150 / 150
    },
    {
      id: 132,
      avg: 0.82, // (39 + 125) / (50 + 150)
      1: 0.78, // 39 / 50
      2: 0.833 // late: (140 - 15) / 150
    }
  ];

//learner data(courseInfo,assignmentGroup,learnerSubmission array)
  return result;
}

function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions){
    let result = [];

    let course_id = courseInfo.id;
    if (course_id != assignmentGroup.course_id) {
        throw new Error("Input is Invalid. Given assignmentgroup course id not matching");
    }

    let assignments = {};
    for (let i=0; i< assignmentGroup.assignments.length; i++){
        let id = assignmentGroup.assignments[i].id;
        assignments[id] = {};
        assignments[id]["name"] = assignmentGroup.assignments[i].name;
        assignments[id]["due_at"] = assignmentGroup.assignments[i].due_at;
        assignments[id]["points_possible"] = assignmentGroup.assignments[i].points_possible;  
    }
    //console.log(assignments);

    let records = {};
    for (let i=0; i< learnerSubmissions.length; i++){  
        let learner_id = learnerSubmissions[i].learner_id;
        let assignment_id = learnerSubmissions[i].assignment_id;
        let score = learnerSubmissions[i].submission.score;
        let submitted_at = learnerSubmissions[i].submission.submitted_at;
        let points_possible = assignments[assignment_id].points_possible;
        let due_at = assignments[assignment_id].due_at;

        if (!(learner_id in records)){
            records[learner_id] = {};
        }
        records[learner_id][assignment_id] = {};
        records[learner_id][assignment_id]["score"] = score;
        records[learner_id][assignment_id]["points_possible"] = points_possible;
        records[learner_id][assignment_id]["submitted_at"] = submitted_at;
        records[learner_id][assignment_id]["due_at"] = due_at;
        records[learner_id][assignment_id]["percentage"] = score/points_possible;
    }

    //console.log(records);

    for (const learner_id in records){
        let row = {};
        row["id"] = learner_id;
        let total_score = 0;
        let total_points = 0;
        for( const assignment_id in records[learner_id]){
            const today = new Date();
            let due_date = new Date(records[learner_id][assignment_id].due_at);
            if (due_date <= today){
                row[assignment_id] = records[learner_id][assignment_id].percentage;
                total_score+=records[learner_id][assignment_id].score;
                total_points+=records[learner_id][assignment_id].points_possible;
            }
        }
        row["avg"] = total_score/total_points;
        result.push(row);
    }
    return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);

