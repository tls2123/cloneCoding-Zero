import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import ImagesZoom from '../components/ImagesZoom/index';

//alt를 잘 사용하면 시각장애인분들께 도움이 된다고 한다.
//여기의 alt는 이미지의 설명
const PostImages = ({ images }) => {
    const [showImageZoom, setShowImageZoom] = useState(false);
    //클릭을 하면 더 확대해서 볼 수 있게 만드는 
    const onZoom = useCallback(() => {
        setShowImageZoom(true);
    });
    const onClose = useCallback(() => {
        setShowImageZoom(false)
    })
    if (images.length === 1) {
        return (
            <>
                <img role='presentation' src={`http://localhost:3065/${images[0].src}`} alt={images[0].src} onClick={onZoom} />
                {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        )
    }
    if (images.length === 2) {
        return (
            <>
                <img role='presentation' style={{ width: '50%', display: 'inline-block' }} src={`http://localhost:3065/${images[0].src}`} alt={images[0].src} onClick={onZoom} />
                <img role='presentation' style={{ width: '50%', display: 'inline-block' }} src={`http://localhost:3065/${images[1].src}`} alt={images[1].src} onClick={onZoom} />
                {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        )
    }
    return (
        <>
            <div>
                <img role='presentation' style={{ width: '50%' }} src={`http://localhost:3065/${images[0].src}`} alt={images[0].src} onClick={onZoom} />
                <div
                    role='presentation'
                    style={{ display: 'inline-block', width: '50%', textAlign: 'center', varticalAlign: 'middle' }}
                    onClick={onZoom}
                >
                    <PlusOutlined />
                    <br />
                    {images.length - 1}
                    개의 사진 더보기
                </div>
            </div>
            {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
        </>
    )

}

PostImages.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object)
}
export default PostImages;