import React, { useState, useEffect } from 'react';
import { List, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { ReportProblemOutlined as ReportIcon } from '@mui/icons-material';
import axiosInstance from '../config/AxiosConfig';
import {
    CommentsContainer,
    CommentListItem,
    CommentAvatar,
    CommentContentBox,
    CommentMetaBox,
    CommentNickname,
    CommentTimestamp,
    CommentDivider,
    CommentTextField,
    SubmitButton
} from '../style/StyledComponents';

interface CommentType {
    id: number;
    content: string;
    articleId: number;
    memberId: number;
    memberNickname: string;
    profileImageURL: string;
    timestamp: string;
}

interface CommentsProps {
    comments: CommentType[];
    onAddComment: (text: string) => void;
}

interface ReportReason {
    name: string;
    description: string;
}

const Comments: React.FC<CommentsProps> = ({ comments, onAddComment }) => {
    const [newComment, setNewComment] = useState<string>('');
    const [openReportModal, setOpenReportModal] = useState<boolean>(false);
    const [reportReasons, setReportReasons] = useState<ReportReason[]>([]);
    const [selectedComment, setSelectedComment] = useState<number | null>(null);
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);

    useEffect(() => {
        if (openReportModal) {
            axiosInstance.get('/enum-list/comment-report-reasons')
                .then(response => {
                    setReportReasons(response.data);
                })
                .catch(error => {
                });
        }
    }, [openReportModal]);

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            onAddComment(newComment.trim()); // 댓글 추가
            setNewComment(''); // 입력 필드 초기화
        }
    };

    const handleReportClick = (commentId: number) => {
        setSelectedComment(commentId);
        setOpenReportModal(true);
    };

    const handleReportModalClose = () => {
        setOpenReportModal(false);
        setSelectedReason('');
    };

    const handleReportReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedReason(event.target.value);
    };

    const handleReportSubmit = () => {
        if (selectedComment !== null && selectedReason) {
            const reportData = {
                commentId: selectedComment,
                reason: selectedReason,
            };
            axiosInstance.post(`/api/comment/${selectedComment}/report`, reportData)
                .then(response => {
                    setOpenReportModal(false);
                    setOpenConfirmationModal(true);
                })
                .catch(error => {
                    console.error('Failed to submit report:', error);
                });
        }
    };

    const handleConfirmationModalClose = () => {
        setOpenConfirmationModal(false);
    };

    return (
        <CommentsContainer>
            <Typography variant="h6">{`Comments: ${comments.length}`}</Typography>
            <List>
                {comments.map((comment) => (
                    <React.Fragment key={comment.id}>
                        <CommentListItem>
                            <CommentAvatar src={comment.profileImageURL} />
                            <CommentContentBox>
                                <CommentMetaBox>
                                    <CommentNickname variant="subtitle1">
                                        {comment.memberNickname}
                                    </CommentNickname>
                                    <CommentTimestamp variant="caption">
                                        {comment.timestamp}
                                    </CommentTimestamp>
                                    <IconButton
                                        size="small"
                                        sx={{ ml: 2, color: 'white' }}
                                        onClick={() => handleReportClick(comment.id)}
                                    >
                                        <ReportIcon />
                                    </IconButton>
                                </CommentMetaBox>
                                <Typography variant="body2">
                                    {comment.content}
                                </Typography>
                            </CommentContentBox>
                        </CommentListItem>
                        <CommentDivider />
                    </React.Fragment>
                ))}
            </List>
            <CommentTextField
                label="Add a comment"
                variant="outlined"
                fullWidth
                value={newComment}
                onChange={handleCommentChange}
                sx={{ borderRadius: '8px' }} // 입력 필드의 테두리를 둥글게 설정
            />
            <SubmitButton
                variant="contained"
                color="primary"
                onClick={handleCommentSubmit}
                sx={{ borderRadius: '8px', marginTop: '8px' }} // 버튼의 테두리를 둥글게 설정
            >
                Submit
            </SubmitButton>

            {/* Report Reasons Modal */}
            <Dialog
                open={openReportModal}
                onClose={handleReportModalClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#1f2a3c', // 배경색 설정
                        color: 'white',     // 텍스트 색상 설정
                        borderRadius: '12px' // 모달의 테두리를 둥글게 설정
                    },
                }}
            >
                <DialogTitle sx={{ bgcolor: '#1f2a3c', color: 'white', borderRadius: '12px 12px 0 0' }}>
                    Select a report reason
                </DialogTitle>
                <DialogContent sx={{ bgcolor: '#1f2a3c', color: 'white' }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ color: 'white' }}>What's going on?</FormLabel>
                        <RadioGroup
                            aria-label="report-reason"
                            name="report-reason"
                            value={selectedReason}
                            onChange={handleReportReasonChange}
                        >
                            {reportReasons.map((reason) => (
                                <FormControlLabel
                                    key={reason.name}
                                    value={reason.name}
                                    control={<Radio sx={{ color: 'white' }} />}
                                    label={reason.description}
                                    sx={{ color: 'white' }}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ bgcolor: '#1f2a3c', color: 'white', borderRadius: '0 0 12px 12px' }}>
                    <Button onClick={handleReportModalClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleReportSubmit} color="primary" disabled={!selectedReason}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Modal */}
            <Dialog
                open={openConfirmationModal}
                onClose={handleConfirmationModalClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#1f2a3c',
                        color: 'white',
                        borderRadius: '12px'
                    },
                }}
            >
                <DialogTitle sx={{ bgcolor: '#1f2a3c', color: 'white', borderRadius: '12px 12px 0 0' }}>
                    신고
                </DialogTitle>
                <DialogContent sx={{ bgcolor: '#1f2a3c', color: 'white' }}>
                    <DialogContent sx={{ bgcolor: '#1f2a3c', color: 'white' }}>
                        <Typography variant="body1">
                            커뮤니티에 도움을 주셔서 감사합니다
                        </Typography>
                        <div style={{ margin: '16px 0' }} />
                        <Typography variant="body1">
                            신고해 주신 내용은 유해한 콘텐츠로부터 커뮤니티를 보호하는 데 도움이 됩니다.
                        </Typography>
                        <div style={{ margin: '16px 0' }} />
                        <Typography variant="body1">
                            누군가 위급한 상황에 처했다고 생각한다면 현지 법 집행 기관에 연락하세요.
                        </Typography>
                        <div style={{ margin: '16px 0' }} />
                        <Typography variant="body1">
                            다음 단계
                        </Typography>
                        <div style={{ margin: '16px 0' }} />
                        <Typography variant="body1">
                            심각하거나 반복적인 위반에 해당할 경우 YouTube에서 이 댓글 작성자가 댓글을 올리지 못하도록 일시적으로 제한할 수 있습니다.
                        </Typography>
                    </DialogContent>

                </DialogContent>
                <DialogActions sx={{ bgcolor: '#1f2a3c', color: 'white', borderRadius: '0 0 12px 12px' }}>
                    <Button onClick={handleConfirmationModalClose} color="primary">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
        </CommentsContainer>
    );
};

export default Comments;
