import { useEmotionTracking } from "../context/EmotionTracking";

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { isTracking, setIsTracking } = useEmotionTracking();

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">
        Session Settings
      </h2>
      <button
        aria-label="Close settings"
        onClick={onClose}
        className="text-purple-600 hover:text-purple-800 text-2xl font-bold"
      >
        &times;
      </button>

      <label className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={isTracking}
          onChange={(e) => setIsTracking(e.target.checked)}
          className="form-checkbox h-4 w-4 text-purple-600"
        />
        <span className="text-sm text-gray-700">Enable Emotion Tracking</span>
      </label>

      <p className="text-xs text-gray-500 mt-2">
        Uses webcam to detect emotions. No video is recorded or stored.
      </p>
    </div>
  );
};

export default Settings;
