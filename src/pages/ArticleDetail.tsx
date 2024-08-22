import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button, Chip } from '@mui/material';
import axiosInstance from '../config/AxiosConfig';
import MostHotArticles from '../components/MostHotArticles';
import Comments from '../components/Comments';
import BookmarkButton from '@mui/icons-material/Bookmark';
import CategoryChip from '../components/Button/CategoryButton'; // CategoryChip 임포트
import {Article as ArticleType, CommentType} from '../types/Article';

const ArticleDetail: React.FC = () => {
    const { articleId } = useParams<{ articleId: string }>();
    const location = useLocation();
    const initialArticle = location.state?.article as ArticleType;
    const [article, setArticle] = useState<ArticleType | null>(initialArticle);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                await axiosInstance.get(`/article/article/${articleId}`);
                // const response = await axiosInstance.get(`/article/article/${articleId}`);
                //setArticle(response.data);
            } catch (err) {
                setError('Failed to fetch article');
            }
        };

        const incrementCount = async () => {
            try {
                await axiosInstance.post(`/rank/increment-article-count/${articleId}`);
            } catch (err) {
                console.error('Failed to increment article count', err);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axiosInstance.get(`/api/comment/article/${articleId}`);
                setComments(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch comments');
                setLoading(false);
            }
        };

        // if (!initialArticle) {
        //     fetchArticle();
        // }
        fetchArticle();
        incrementCount();
        fetchComments();
    }, [articleId, initialArticle]);

    const handleAddComment = async (text: string) => {
        try {
            const response = await axiosInstance.post('/api/comment', {
                content: text,
                articleId: article?.id,
                // memberId: 1, // 예시로 회원 ID를 하드코딩합니다. 실제 구현에서는 현재 로그인한 사용자의 ID를 사용해야 합니다.
                // memberNickname: 'User', // 예시로 사용자 이름을 하드코딩합니다. 실제 구현에서는 현재 로그인한 사용자의 이름을 사용해야 합니다.
                // profileImageURL: 'https://via.placeholder.com/50', // 예시로 사용자 이미지 URL을 하드코딩합니다. 실제 구현에서는 현재 로그인한 사용자의 이미지 URL을 사용해야 합니다.
                // timestamp: new Date().toISOString(), // 예시로 현재 시간을 사용합니다.
            });
            setComments([...comments, response.data]);
        } catch (err) {
            setError('Failed to add comment');
        }
    };

    if (!article) return <p>기사를 찾을 수 없습니다.</p>;

    const formatContent = (content: string) => {
        const segments = content.split('.');
        const lines = [];
        for (let i = 0; i < segments.length; i += 5) {
            lines.push(segments.slice(i, i + 5).join('.') + '.');
        }
        return lines.join('\n\n');
    };

    return (
        <Box sx={{
            p: 3,
            backgroundImage: 'url(/Background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh'
        }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={9}>
                    <Paper elevation={3} sx={{padding: '20px', color: 'white', bgcolor: '#1f2a3c'}}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap'
                        }}>
                            <Box sx={{flexGrow: 1}}>
                                <Typography variant="h4" gutterBottom sx={{marginBottom: '2rem'}}>
                                    {article.title}
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: "0.5rem",
                                    marginTop: "1rem"
                                }}>
                                    <CategoryChip category={article.category} />
                                    {article.tags.map(tag => (
                                        <Chip key={tag.id} label={tag.name}
                                              sx={{marginRight: "0.5rem", marginBottom: "0.05rem"}}/>
                                    ))}
                                </Box>
                            </Box>
                            <Typography component="a" href={article.source} target="_blank" rel="noopener noreferrer"
                                        sx={{
                                            fontSize: '0.9rem',
                                            color: 'white',
                                            textDecoration: 'none',
                                            marginLeft: 'auto'
                                        }}>
                                {article.source}
                            </Typography>
                        </Box>
                        <hr/>
                        <img src={article.imgUrls[0] || 'https://via.placeholder.com/150'} alt={article.title}
                             style={{width: '100%', height: 'auto', maxHeight: '200rem' , marginBottom: `1rem`}}/>
                        <Typography sx={{ color: '#91bad3', fontSize: '1.2rem', whiteSpace: 'pre-line' }}>
                            {formatContent(article.content)}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" startIcon={<BookmarkButton />} sx={{ bgcolor: '#ff4081', my: 2 }}>
                        Bookmark
                    </Button>
                </Grid>
                <Grid item xs={12} md={9}>
                    {loading ? <p>Loading
                        ...</p> : <Comments comments={comments} onAddComment={handleAddComment} />}
                </Grid>
                <Grid item xs={12} md={3} sx={{ position: 'relative', top: '-100px' }}>
                    <MostHotArticles />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ArticleDetail;
