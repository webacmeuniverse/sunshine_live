
// eslint-disable-next-line complexity
export function stepStatus(step, attachments, meetings, reviews = []) {
  const files = [];
  if (step.meeting || step.uploadInMeeting) {
    (meetings || []).forEach((m) => {
      if ([step.meeting, step.meetingAlias, step.uploadInMeeting].indexOf(m.topic) < 0) {
        return;
      }
      m.attachments.forEach((a) => {
        // NOTE @edimov: This nonsense check `!a.upload_type` is
        // present as previous logic has uploaded files in meetings
        // with no `upload_type` - therefore this includes any file
        // that has been uploaded in meeting prior to this update.
        if (!a.upload_type || a.upload_type === step.uploadType || a.upload_type === step.uploadTypeAlias) {
          files.push(a);
        }
      });
    });
  }

  if (step.uploadType) {
    Object.values(attachments || []).forEach(
      file => file.upload_type === step.uploadType && files.push(file)
    );
  }

  const filesListLength = step.uploadsList?.length || 1;

  if (step.uploadsList) {
    if (files.length >= step.uploadsList.length) {
        return { valid: true, complete: true, progress: 1 };
    }
    return { valid: false, complete: false, progress: parseFloat((files.length / filesListLength).toFixed(2)) };
  }

  if (step.uploadType) {
    if (!step.required) {
        return { valid: true, complete: files.length > 0, files };
    }
    if (files.length > 0) {
        return { valid: true, complete: true, progress: 1, files };
    }
    return { valid: false, complete: false, progress: 0, files };
  }

  if (step.reviews) {
    let progress = 0;
    for (const j in step.reviews) {
      for (const k in reviews) {
        if (reviews[k].type !== step.reviews[j]) {
          continue;
        }
        if (reviews[k].approved) {
          progress++;
        }
        break;
      }
    }

    return { valid: false, complete: true, progress: parseFloat((progress / step.reviews.length).toFixed(2)) };
  }

  return { valid: !step.meeting, complete: !step.meeting };
}
