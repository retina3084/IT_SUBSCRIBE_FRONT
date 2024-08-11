import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Pagination, Chip, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MostHotArticles from '../components/MostHotArticles';
import axiosInstance from '../config/AxiosConfig';
import { Article } from '../types/Article';

const AllArticlesPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/article/all', {
                    params: {
                        page: currentPage - 1,
                        size: 12
                    }
                });

                const { content, totalPages } = response.data;
                setArticles(content);
                setTotalPages(totalPages);
            } catch (error) {
                console.error('Failed to fetch articles', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [currentPage]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleOpenArticle = (article: Article) => {
        navigate(`/article/${article.id}`, { state: { article } });
    };

    return (
        <Box sx={{ flexGrow: 1, backgroundImage: 'url(/Background.png)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
            <Navbar />
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress color="inherit" />
                </Box>
            ) : (
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                            {articles.map((article) => (
                                <Grid item xs={12} sm={6} md={4} key={article.id} onClick={() => handleOpenArticle(article)}>
                                    <Card sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#152238', color: 'white' }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={article.imgUrls[0] || 'https://via.placeholder.com/150'}
                                            alt={article.title}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" sx={{ color: 'white' }}>{article.title}</Typography>
                                            <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', color: 'white' }}>
                                                {article.content}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'white' }}>
                                                {new Date(article.postDate).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'white' }}>
                                                {article.category.name}
                                            </Typography>
                                            <Box sx={{ mt: 1 }}>
                                                {article.tags.map(tag => (
                                                    <Chip key={tag.id} label={tag.name} sx={{ mr: 1, mb: 1, color: 'white', backgroundColor: '#3f51b5' }} />
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            sx={{ mt: 2, display: 'flex', justifyContent: 'center', '& .MuiPaginationItem-root': { color: 'white' } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <MostHotArticles />
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default AllArticlesPage;
//변경전