#!/usr/bin/env ts-node-script
import args from 'args';
import DB from '../models';

const run = async (id) => {
  console.log(`Adding review to patient:${id}`);

  try {
    const patient = await DB.Patient.findByPk(id);

    if (!patient) {
      throw new Error(`Patient:${id} not found`);
    }

    const review = await DB.Review.create({
      title: 'Time to Review',
    });

    const [
      assessment1,
      assessment2,
      assessment3,
      assessment4,
    ] = await Promise.all([
      DB.Assessment.findOne({
        where: { subCategory: 'Anxiety (Check-In)' },
      }),
      DB.Assessment.findOne({
        where: { subCategory: 'Anxiety (Irritability/Anger)' },
      }),
      DB.Assessment.findOne({
        where: { subCategory: 'Depression Check-in' },
      }),
      DB.Assessment.findOne({
        where: { subCategory: 'Mood (Check-In)' },
      }),
    ]);

    console.log({
      patient,
      assessment1,
      assessment2,
      assessment3,
      assessment4,
    });

    await DB.SignalQuestion.create({
      reviewId: review.id,
      assessmentId: assessment1.id,
      content: 'In the past two weeks, have you felt nervous or on edge?',
      type: 'boolean',
      trigger: { answer: 'yes' },
    });

    await DB.SignalQuestion.create({
      reviewId: review.id,
      assessmentId: assessment2.id,
      content:
        'In the past two weeks, have you felt irritable or easily annoyed?',
      type: 'boolean',
      trigger: { answer: 'yes' },
    });

    await DB.SignalQuestion.create({
      reviewId: review.id,
      assessmentId: assessment3.id,
      content: 'Have you been feeling hopeless?',
      type: 'boolean',
      trigger: { answer: 'yes' },
    });

    await DB.SignalQuestion.create({
      reviewId: review.id,
      assessmentId: assessment3.id,
      content:
        'Have you felt a lingering sadness that has lasted more than a few days?',
      type: 'boolean',
      trigger: { answer: 'yes' },
    });

    await DB.SignalQuestion.create({
      reviewId: review.id,
      assessmentId: assessment4.id,
      content: 'Are you in a good mood today?',
      type: 'boolean',
      trigger: { answer: 'yes' },
    });

    await patient.addReview(review);

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
