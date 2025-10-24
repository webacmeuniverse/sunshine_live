import { parseAddress } from '../../asset/utils';

const groupActions = ['lear_apply', 'claim_residency', 'request_membership', 'accept_lear_application', 'create'];

export function groupNotifications(notificationsList) {
  const nodesMap = {};
  for (let i = 0; i < notificationsList.length; i++) {
    const node = notificationsList[i].node;
    if (groupActions.indexOf(node.action) < 0) {
      nodesMap[node.ID] = {
        ID: node.ID,
        new: node.new,
        old: node.old,
        action: node.action,
        targetType: node.targetType,
        targetID: node.targetID,
        targetKey: node.targetKey,
        userID: node.userID,
        userKey: node.userKey,
        seen: node.seen,
        country: node.country,
        comment: node.comment,
        date: node.date,
      };
      continue;
    }

    const key = `${node.action}-${node.targetType}-${node.targetID}-${node.userID}`;
    if (!(key in nodesMap)) {
      nodesMap[key] = {
        key,
        ID: node.ID,
        new: node.new,
        old: node.old,
        action: node.action,
        targetType: node.targetType,
        targetID: node.targetID,
        targetKey: node.targetKey,
        userID: node.userID,
        userKey: node.userKey,
        seen: node.seen,
        country: node.country,
        comment: node.comment,
        date: node.date,
        documents: [],
      };
    }

    nodesMap[key].documents.push({
      notificationID: node.ID,
      name: node.new,
      url: `/${node.targetType}/${node.targetID}/${node.new}`,
    });
  }

  return Object.values(nodesMap);
}

export function parseAssetTargetKey(targetKey) {
  try {
    const targetKeyJSON = JSON.parse(targetKey);
    if (targetKeyJSON.address) {
      return {
        address: parseAddress(targetKeyJSON.address),
        communityOrganizationID: targetKeyJSON.communityOrganizationID,
      };
    }
    return {
      address: parseAddress(targetKey),
      communityOrganizationID: null,
    };
  } catch {
    return { address: parseAddress(targetKey), communityOrganizationID: null };
  }
}

export function filterNotifications(notifications) {
  let filteredNotifications = [...notifications];
  notifications.forEach(el => {
    const newArr = [];
    if ((el.action === 'create' || el.action === 'update') && el.targetType === 'organization') {
      filteredNotifications.forEach(n => {
        if (n.action === 'upload' && n.targetID === el.targetID) {
          return;
        }
        newArr.push(n);
      });
    }
    if (newArr.length > 0) {
      filteredNotifications = newArr;
    }
  });

  return filteredNotifications;
}

export function parseTargetKey({ targetType, targetKey }) {
  if (targetType === 'project') {
    return targetKey;
  }
  try {
    const targetKeyJSON = JSON.parse(targetKey);
    let parsedResult = '';
    if (targetType === 'asset') {
      parsedResult = parseAddress(targetKeyJSON.address);
    }
    if (targetType === 'organization') {
      parsedResult = targetKeyJSON.name;
    }

    if (!parsedResult) {
      throw new Error();
    }

    return parsedResult;
  } catch {
    if (targetType === 'asset') {
      return parseAddress(targetKey);
    }
    return targetKey;
  }
}