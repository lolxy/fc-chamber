import _ from 'lodash';

export default () => {
  const friendGroup = _.map(window.myFriendGroups, (group) => {
    let groupId = group.Id;
    if (groupId === '00000000-0000-0000-0000-000000000000') {
      groupId = 'null';
    }
    if (groupId === '00000000-0000-0000-0000-000000000001') {
      groupId = 'colleague';
    }
    return {
      Id: groupId,
      Name: group.Name,
      MeId: group.MeId,
      Notes: group.Notes,
      Ordering: group.Ordering,
    };
  });
  return friendGroup;
};
