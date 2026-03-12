const Team = require('../models/Team');
const Evaluation = require('../models/Evaluation');
const FormResponse = require('../models/FormResponse');
const Form = require('../models/Form');
const asyncHandler = require('../middleware/asyncHandler');
const { generateCSV } = require('../services/export.service');

// GET /api/v1/export/teams
const exportTeamsCSV = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.hackathonId) {
    filter.hackathonId = req.query.hackathonId;
  }

  const teams = await Team.find(filter)
    .populate('members.userId', 'name email')
    .populate('assignedJudges', 'name email')
    .lean();

  const data = teams.map((team) => ({
    teamName: team.teamName,
    hackathonId: team.hackathonId,
    memberCount: team.members.length,
    members: team.members.map((m) => (m.userId ? `${m.userId.name} (${m.userId.email})` : 'N/A')).join('; '),
    judgeCount: team.assignedJudges.length,
    judges: team.assignedJudges.map((j) => (j ? `${j.name} (${j.email})` : 'N/A')).join('; '),
    githubRepo: team.githubRepo || '',
    inviteCode: team.inviteCode,
    createdAt: team.createdAt ? new Date(team.createdAt).toISOString() : '',
  }));

  const columns = [
    { id: 'teamName', title: 'Team Name' },
    { id: 'hackathonId', title: 'Hackathon ID' },
    { id: 'memberCount', title: 'Member Count' },
    { id: 'members', title: 'Members' },
    { id: 'judgeCount', title: 'Judge Count' },
    { id: 'judges', title: 'Assigned Judges' },
    { id: 'githubRepo', title: 'GitHub Repo' },
    { id: 'inviteCode', title: 'Invite Code' },
    { id: 'createdAt', title: 'Created At' },
  ];

  const csvBuffer = generateCSV(data, columns);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=teams-export.csv');
  res.send(csvBuffer);
});

// GET /api/v1/export/scores
const exportScoresCSV = asyncHandler(async (req, res) => {
  const evaluations = await Evaluation.find({})
    .populate('judgeId', 'name email')
    .populate('teamId', 'teamName hackathonId')
    .sort('-submittedAt')
    .lean();

  const data = evaluations.map((ev) => ({
    teamName: ev.teamId ? ev.teamId.teamName : 'N/A',
    hackathonId: ev.teamId ? ev.teamId.hackathonId : 'N/A',
    judgeName: ev.judgeId ? ev.judgeId.name : 'N/A',
    judgeEmail: ev.judgeId ? ev.judgeId.email : 'N/A',
    innovation: ev.scores.innovation,
    technical: ev.scores.technical,
    uiux: ev.scores.uiux,
    presentation: ev.scores.presentation,
    total:
      ev.scores.innovation + ev.scores.technical + ev.scores.uiux + ev.scores.presentation,
    comments: ev.comments || '',
    submittedAt: ev.submittedAt ? new Date(ev.submittedAt).toISOString() : '',
  }));

  const columns = [
    { id: 'teamName', title: 'Team Name' },
    { id: 'hackathonId', title: 'Hackathon ID' },
    { id: 'judgeName', title: 'Judge Name' },
    { id: 'judgeEmail', title: 'Judge Email' },
    { id: 'innovation', title: 'Innovation' },
    { id: 'technical', title: 'Technical' },
    { id: 'uiux', title: 'UI/UX' },
    { id: 'presentation', title: 'Presentation' },
    { id: 'total', title: 'Total' },
    { id: 'comments', title: 'Comments' },
    { id: 'submittedAt', title: 'Submitted At' },
  ];

  const csvBuffer = generateCSV(data, columns);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=scores-export.csv');
  res.send(csvBuffer);
});

// GET /api/v1/export/submissions
const exportSubmissionsCSV = asyncHandler(async (req, res) => {
  const responses = await FormResponse.find({})
    .populate('formId', 'title formType hackathonId questions')
    .populate('teamId', 'teamName')
    .sort('-submittedAt')
    .lean();

  const data = responses.map((resp) => {
    const answersStr = resp.answers
      .map((a) => {
        // Try to find the matching question text
        let questionText = a.questionId.toString();
        if (resp.formId && resp.formId.questions) {
          const q = resp.formId.questions.find(
            (question) => question._id.toString() === a.questionId.toString()
          );
          if (q) {
            questionText = q.question;
          }
        }
        return `${questionText}: ${a.value}`;
      })
      .join(' | ');

    return {
      formTitle: resp.formId ? resp.formId.title : 'N/A',
      formType: resp.formId ? resp.formId.formType : 'N/A',
      hackathonId: resp.formId ? resp.formId.hackathonId : 'N/A',
      teamName: resp.teamId ? resp.teamId.teamName : 'N/A',
      answers: answersStr,
      submittedAt: resp.submittedAt ? new Date(resp.submittedAt).toISOString() : '',
    };
  });

  const columns = [
    { id: 'formTitle', title: 'Form Title' },
    { id: 'formType', title: 'Form Type' },
    { id: 'hackathonId', title: 'Hackathon ID' },
    { id: 'teamName', title: 'Team Name' },
    { id: 'answers', title: 'Answers' },
    { id: 'submittedAt', title: 'Submitted At' },
  ];

  const csvBuffer = generateCSV(data, columns);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=submissions-export.csv');
  res.send(csvBuffer);
});

module.exports = {
  exportTeamsCSV,
  exportScoresCSV,
  exportSubmissionsCSV,
};
