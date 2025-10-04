import { ThreeDot } from 'react-loading-indicators'
const BlockingLoader: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div
      style={{ zIndex: 3000 }}
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center"
    >
      <ThreeDot
        variant="bounce"
        color="#006766"
        size="medium"
        text={text || 'Loading'}
        textColor="#006766"
      />
    </div>
  )
}
export default BlockingLoader
