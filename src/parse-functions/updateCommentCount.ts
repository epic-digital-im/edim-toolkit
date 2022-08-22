import { Comment } from '@app/shared/parse-types';

export const updateCommentCount = async (Parse: any, comment: Comment, inc?: boolean) => {
  const subjectClass = comment.get('subjectClass');
  const subjectId = comment.get('subjectId');
  const context = comment.get('context');

  const SubjectClassObject = Parse.Object.extend(subjectClass);
  const SubjectClassQuery = new Parse.Query(SubjectClassObject);
  const subject = await SubjectClassQuery.get(subjectId, { useMasterKey: true });

  const commentCount = subject.get('commentCount');

  if (!commentCount) {
    const count = { count: 0 };
    if (context) {
      count[context] = 0;
    }
    subject.set('commentCount', count);
    await subject.save(null, { useMasterKey: true });
  }


  const incVal = (context)
    ? `commentCount.${context}`
    : 'commentCount.count';

  if (inc) {
    subject.increment(incVal);
  } else {
    subject.decrement(incVal);
  }

  await subject.save(null, { useMasterKey: true });
}
