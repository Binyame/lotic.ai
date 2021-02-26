#!/usr/bin/env ts-node-script

import args from 'args';
import DB from '../models';
import { sample } from 'lodash';
const run = async (id) => {
  console.log(`Adding Assessments to patient:${id}`);
  try {
    const patient = await DB.Patient.findByPk(id);
    if (!patient) {
      throw new Error(`Patient:${id} not found`);
    }
    const assessments = await DB.Assessment.findAll();
    for (const assessment of assessments) {
      const opts = {
        patientId: patient.id,
        assessmentId: assessment.id,
        type: sample(['lotic', 'bookmark', 'clinician']),
        completed: 'false',
      };
      try {
        await DB.PatientAssessment.create(opts);
      } catch (e) {
        console.log('assessment probably exists');
      }
    }
    console.log('DONE');
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
// Process arguments from the command line
args.option('id', 'The Patient ID to add assessments to');
const flags = args.parse(process.argv);
//Run primary function
//Note:  will probably hang and not return unless process.exit called
run(flags.id);
// must export something for isolated modules
export default run;
