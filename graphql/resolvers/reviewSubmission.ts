import { generateResolvers } from '../resolver';

export default generateResolvers('ReviewSubmission', ['patient', 'review'], {
  Mutation: {
    createReviewSubmission: async (root, args, ctx, info) => {
      const {
        patientId,
        reviewId,
        body,
        patientReviewId,
      } = args.reviewSubmission;

      const record = await ctx.db.ReviewSubmission.create({
        patientId,
        reviewId,
        body,
      });

      if (patientReviewId) {
        const pr = await ctx.db.PatientReview.findByPk(patientReviewId);

        if (pr && pr.patientId === patientId) {
          pr.update({ completed: true });
        }
      }

      return record;
    },
  },
});
