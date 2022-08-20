import { Comment } from '@app/shared/parse-types';

export const updateCommentCount = async (Parse: any, comment: Comment, inc?: boolean) => {
  const subjectClass = comment.get('subjectClass');
  const subjectId = comment.get('subjectId');
  const subjectProp = comment.get('subjectProp');

  const SubjectClassObject = Parse.Object.extend(subjectClass);
  const SubjectClassQuery = new Parse.Query(SubjectClassObject);
  const subject = await SubjectClassQuery.get(subjectId, { useMasterKey: true });

  const commentCount = subject.get('commentCount');

  if (!commentCount) {
    const count = { count: 0 };
    if (subjectProp) {
      count[subjectProp] = 0;
    }
    subject.set('commentCount', count);
    await subject.save(null, { useMasterKey: true });
  }


  const incVal = (subjectProp)
    ? `commentCount.${subjectProp}`
    : 'commentCount.count';

  if (inc) {
    subject.increment(incVal);
  } else {
    subject.decrement(incVal);
  }

  await subject.save(null, { useMasterKey: true });
}
