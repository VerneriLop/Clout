import React, {useCallback} from 'react';
import {
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {CommentList} from '../../components/Comment/CommentList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {CommentType, CustomImage} from '../../types/types';
import {CommentInputFooter} from './CommentInputFooter';
import {useAddCommentMutation} from '../../redux/slices/mockApiSlice';

type CommentModalProps = Omit<BottomSheetModalProps, 'children'> & {
  comments: CommentType[];
  commentSheetRef: React.RefObject<BottomSheetModal>;
  selectedPost: CustomImage;
};

export const CommentModal = ({
  comments,
  commentSheetRef,
  selectedPost,
  ...props
}: CommentModalProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();

  const [addComment] = useAddCommentMutation();

  const handleAddComment = useCallback(
    (input: string) => {
      addComment({image_id: selectedPost.id, comment: input});
    },
    [addComment, selectedPost.id],
  );

  const renderFooter = useCallback(
    (footerProps: BottomSheetFooterProps) => (
      <CommentInputFooter
        {...footerProps}
        handleAddComment={handleAddComment}
      />
    ),
    [handleAddComment],
  );

  return (
    <BottomSheetModal
      {...props}
      ref={commentSheetRef}
      enablePanDownToClose
      index={0}
      backgroundStyle={{backgroundColor: colors.card}}
      handleIndicatorStyle={{backgroundColor: colors.border}}
      footerComponent={renderFooter}
      topInset={insets.top}>
      <BottomSheetView style={styles.container}>
        <CommentList data={comments} />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {gap: 10, flex: 1}, //REMEMBER FLEX 1, OTHERWISE LIST WONT RENDER CORRECTLY
  footerContainer: {
    padding: 4,
    margin: 4,
    borderRadius: 12,
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
});
