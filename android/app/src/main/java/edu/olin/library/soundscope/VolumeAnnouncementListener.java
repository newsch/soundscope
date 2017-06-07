package edu.olin.library.soundscope;

import android.util.Log;
import android.widget.TextView;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.Socket;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class VolumeAnnouncementListener {


    private Socket mSocket;
    private SoundManager mSoundManager;
    private Emitter.Listener onVolumeChange = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
//            if
            String json = (String) args[0];
            JSONObject data;
            try {
                data = new JSONObject(json);
            } catch (Throwable t) {
                Log.e("Soundscope", "Could not parse malformed JSON: \"" + json + "\"");
                return;
            }
            JSONArray volumes;
            try {
                volumes = data.getJSONArray("volumes");
            } catch (JSONException e) {
                Log.e("Soundscope", "Error retrieving volumes from JSON object. JSON: \"" + json + "\"");
                return;
            }

            mSoundManager.setVolumes(volumes);
//            updateTextViewValues(volumes);

        }
    };
    private ArrayList<TextView> mTextViews;
    private String mUUID;

    public VolumeAnnouncementListener(Socket socket, SoundManager soundManager, String UUID, ArrayList<TextView> textViews) {
        mSocket = socket;
        mSoundManager = soundManager;
        mUUID = UUID;
        mTextViews = textViews;

        mSocket.on("volumes", onVolumeChange);
    }

    public void connect() {
        mSocket.connect();
    }

    public void disconnect() {
        mSocket.disconnect();
    }

    private void updateTextViewValues(JSONArray volumes) {

        for (int i = 0; i < volumes.length(); ++i) {
            float level;
            try {
                JSONObject obj = volumes.getJSONObject(i);
                level = (float)obj.getDouble("vol");

            } catch (JSONException e) {
                return;
            }
            TextView tv = mTextViews.get(i);
            tv.setText("Level: " + level);
        }
    }

}
