package edu.olin.library.soundscope;

import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.media.MediaPlayer;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

/**
 * Handles loading the appropriate sound files and playing them back at the correct volumes.
 */

public class SoundManager {

    private boolean isPlaying = false;
    private ArrayList<MediaPlayer> mediaPlayers = new ArrayList<>();
    private ArrayList<Integer> soundFiles = new ArrayList<>(Arrays.asList(
            R.raw.coqui,
            R.raw.lawn_mower,
            R.raw.lawn_mower,
            R.raw.crows
        ));


    public SoundManager(Context context, int numSounds) {
//        Resources resources = context.getResources();
        for (short i = 0; i < numSounds; ++i) {
            MediaPlayer mediaPlayer = MediaPlayer.create(context, soundFiles.get(i));
            mediaPlayer.setLooping(true);
            mediaPlayers.add(mediaPlayer);
        }
    }

    public void play() {
        for (MediaPlayer player: mediaPlayers) {
            player.start();
        }
        isPlaying = true;
    }

    public void stop() {
        if (isPlaying) {
            Log.d("stop", "Stopping playback");
            for (MediaPlayer player : mediaPlayers) {
                player.stop();
            }
            isPlaying = false;
        }
    }

    public void setVolumes(JSONArray volumes) {
        for (int i = 0; i < volumes.length(); ++i) {
            MediaPlayer mp = mediaPlayers.get(i);
            float level;
            try {
                JSONObject obj = volumes.getJSONObject(i);
                level = (float)obj.getDouble("vol");
                Log.d("setVolumes", "Source " + i + " level: " + level);
            } catch (JSONException e) {
                Log.e("setVolumes", "Error retrieving individual volume.");
                return;
            }
            mp.setVolume(level, level);
        }

        if (!isPlaying)
            play();
    }

}
