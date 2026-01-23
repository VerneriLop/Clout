import React, {Dispatch, SetStateAction} from 'react';
import {Modal, ModalProps, StyleSheet, View} from 'react-native';

import {useTheme} from '../../hooks/useTheme';
import {UserList} from '../UserList/UserList';

import {LikeOwner} from '../../types/types';

type LikeModalProps = {
  likeModalVisible: boolean;
  setLikeModalVisible: Dispatch<SetStateAction<boolean>>;
  likedUsers: LikeOwner[];
  refetchLikes: () => void;
  isLoadingLikes: boolean;
};

export const LikeModal = ({
  likeModalVisible,
  setLikeModalVisible,
  likedUsers,
  refetchLikes,
  isLoadingLikes,
  ...props
}: LikeModalProps & Omit<ModalProps, 'children'>) => {
  const {colors} = useTheme();
  return (
    <Modal
      {...props}
      animationType="slide"
      visible={likeModalVisible}
      onRequestClose={() => {
        setLikeModalVisible(false);
      }}
      allowSwipeDismissal
      presentationStyle="pageSheet">
      <View style={{flex: 1, backgroundColor: colors.card}}>
        <UserList
          data={likedUsers}
          onModal
          onRefresh={refetchLikes}
          isFetchingData={isLoadingLikes}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});
