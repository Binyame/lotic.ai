#!/usr/bin/env ts-node-script

import { readFileSync } from 'fs';
import parse from 'csv-parse/lib/sync';
import { resolve } from 'path';
import DB from '../models';
import { groupBy } from 'lodash';

const assessmentsPath = resolve(
  __dirname,
  'assessment_data',
  'assessments.csv'
);
const promptsPath = resolve(__dirname, 'assessment_data', 'prompts.csv');
const questionsPath = resolve(
  __dirname,
  'assessment_data',
  'signal_questions.csv'
);

export async function importAssessments() {
  // await DB.sequelize.sync({ force: true });

  const assessments = readFileSync(assessmentsPath, 'utf-8');
  const prompts = readFileSync(promptsPath, 'utf-8');

  const assessmentsObj = parse(assessments, {
    columns: true,
    skip_empty_lines: true,
  });
  const promptsObj = parse(prompts, {
    columns: true,
    skip_empty_lines: true,
  });

  const promptGroups = groupBy(
    promptsObj,
    'Assessment Name -  Topic (Sub Category)'
  );

  // Create the FreeShare Assessment
  await DB.Assessment.create({
    ownerType: 'lotic',
    ownerId: 1,
    name: 'Free Share',
    area: 'MIND',
    subCategory: 'Free Share',
    hashTag: ' ',
    permanent: true,
  });

  var momentId = '1';
  var AssessmentId;
  var PromptId;

  for (const _a of assessmentsObj) {
    if (momentId !== _a['﻿Moment ID']) {
      momentId = _a['﻿Moment ID'];
      const createAssessmentRequest = {
        name: _a['Moment Name - Topic'],
        area: _a['Type of Moment'],
        subCategory: _a['Primary Topic'],
        hashTag: _a['Ladders to Topic (1)'],
        ownerType: 'lotic',
        ownerId: 1,
      };
      const Assessment = await DB.Assessment.create(createAssessmentRequest);
      AssessmentId = Assessment.dataValues.id;
    }

    const createPromptRequest = {
      order: parseInt(_a['Order'], 10) || 1,
      durationMs: parseInt(_a['Duration (seconds)'], 10) * 1000 || 60000,
      content: _a['Prompt'],
    };

    const Prompt = await DB.Prompt.create(createPromptRequest);
    PromptId = Prompt.dataValues.id;

    const createAssessmentPromptRequest = {
      assessmentId: AssessmentId,
      promptId: PromptId,
    };
    await DB.AssessmentPrompt.create(createAssessmentPromptRequest);
  }
}

const run = async () => {
  await importAssessments();

  process.exit(0);
};

//Run primary function
//Note:  will probably hang and not return unless process.exit called
// run();

// must export something for isolated modules
export default run;
