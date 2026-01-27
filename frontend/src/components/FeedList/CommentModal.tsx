import React, {Dispatch, SetStateAction, useCallback, useState} from 'react';
import {Modal, ModalProps, StyleSheet, View} from 'react-native';

import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useSelectedFeedPost} from '../../hooks/useSelectedFeedPost';
import {useCreateCommentMutation} from '../../redux/api/endpoints/posts';
import {CommentList} from '../Comment/CommentList';
import {CommentInputFooter} from './CommentInputFooter';

type CommentModalProps = {
  commentModalVisible: boolean;
  setCommentModalVisible: Dispatch<SetStateAction<boolean>>;
};

export const CommentModal = ({
  commentModalVisible,
  setCommentModalVisible,
  ...props
}: CommentModalProps & Omit<ModalProps, 'children'>) => {
  const insets = useSafeAreaInsets();
  const {selectedPost} = useSelectedFeedPost();
  const {colors} = useTheme();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [addComment] = useCreateCommentMutation();

  const handleAddComment = useCallback(
    (input: string) => {
      selectedPost && addComment({post_id: selectedPost.id, content: input});
    },
    [addComment, selectedPost?.id],
  );

  const Footer = useCallback(
    (footerProps: any) => (
      <CommentInputFooter
        {...footerProps}
        handleAddComment={handleAddComment}
        blurred={!!editingCommentId}
      />
    ),
    [editingCommentId, handleAddComment],
  );

  return (
    <Modal
      {...props}
      animationType="slide"
      visible={commentModalVisible}
      onRequestClose={() => {
        setCommentModalVisible(false);
      }}
      allowSwipeDismissal
      presentationStyle="pageSheet">
      <View style={{flex: 1, backgroundColor: colors.card}}>
        <CommentList
          onItemPress={() => {}}
          editingCommentId={editingCommentId}
          onStartEdit={id => setEditingCommentId(id)}
          onStopEdit={() => setEditingCommentId(null)}
          editingActive={!!editingCommentId}
        />
        {!editingCommentId && <Footer />}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});
