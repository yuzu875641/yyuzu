// file: pages/video/[videoId].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../../styles/Video.module.css';

export default function VideoPage() {
    const router = useRouter();
    const { videoId } = router.query;
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!videoId) return;

        const fetchVideoData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/video/${videoId}`);
                setVideoData(res.data);
            } catch (err) {
                setError('動画情報の取得に失敗しました。');
            } finally {
                setLoading(false);
            }
        };

        fetchVideoData();
    }, [videoId]);

    if (loading) return <div>動画情報を読み込み中...</div>;
    if (error) return <div>{error}</div>;
    if (!videoData) return <div>動画が見つかりませんでした。</div>;

    const videoEmbedUrl = videoData.formatStreams?.[0]?.url;

    return (
        <div className={styles.container}>
            <div className={styles.videoPlayer}>
                {videoEmbedUrl && (
                    <iframe
                        src={videoEmbedUrl}
                        title={videoData.title}
                        allowFullScreen
                    ></iframe>
                )}
            </div>
            <div className={styles.videoDetails}>
                <h1>{videoData.title}</h1>
                <div className={styles.authorInfo}>
                    <img 
                      src={videoData.authorThumbnails?.[0]?.url} 
                      alt={videoData.author} 
                      className={styles.authorThumbnail} 
                    />
                    <span>{videoData.author}</span>
                </div>
                <div className={styles.stats}>
                    <span>視聴回数: {videoData.viewCount}</span>
                    <span>高評価数: {videoData.likeCount}</span>
                </div>
                <p className={styles.description}>{videoData.description}</p>
            </div>
            <div className={styles.recommendedVideos}>
                <h2>関連動画</h2>
                {videoData.recommendedVideos?.map(video => (
                    <div key={video.id} className={styles.recommendedCard} onClick={() => router.push(`/video/${video.videoId}`)}>
                        <img src={video.videoThumbnails?.[0]?.url} alt={video.title} />
                        <p>{video.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
