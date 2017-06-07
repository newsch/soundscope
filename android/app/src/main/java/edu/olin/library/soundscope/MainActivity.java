package edu.olin.library.soundscope;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Location;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import android.widget.TextView;

import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import com.google.android.gms.location.LocationServices;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.StringTokenizer;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;

public class MainActivity extends AppCompatActivity {

    static final int MY_PERMISSIONS_REQUEST_INTERNET = 1995;
    static final int MY_PERMISSIONS_REQUEST_GET_LOCATION = 1996;
    static final long BROADCAST_INTERVAL = 300; // ms?
    static final String SERVER_URL = "http://192.168.35.111:8080";

    private Socket mSocket;
    {
        try {
            mSocket = IO.socket(MainActivity.SERVER_URL);
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }

    LocationFetcher mLocFetcher;
    LocationPublisher mLocPublisher;
    Timer mTimer;
    LocationUpdateAndBroadcastTask mTimerTask;
    VolumeAnnouncementListener mListener;
    SoundManager mSoundManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Generate a random unique identifier for this session (for mapping
            // multiple devices)
        String mRandUUID = UUID.randomUUID().toString();

        // Check to make sure we have permission to access the device's location
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_DENIED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, MY_PERMISSIONS_REQUEST_GET_LOCATION);
        }
        // Check to make sure we have permission to access the Internet
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.INTERNET) == PackageManager.PERMISSION_DENIED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.INTERNET}, MY_PERMISSIONS_REQUEST_INTERNET);
        }

        mLocFetcher = new LocationFetcher(this);
        mLocFetcher.connect();
        mLocPublisher = new LocationPublisher(mSocket, mRandUUID);

        // Sounds
        ArrayList<TextView> textViews = new ArrayList<TextView>();
        textViews.add((TextView)findViewById(R.id.vol_1));
        textViews.add((TextView)findViewById(R.id.vol_2));
        textViews.add((TextView)findViewById(R.id.vol_3));
        textViews.add((TextView)findViewById(R.id.vol_4));
        mSoundManager = new SoundManager(this, 4);
        mListener = new VolumeAnnouncementListener(mSocket, mSoundManager, mRandUUID, textViews);

    }

    @Override
    protected void onStart() {
        super.onStart();

    }

    @Override
    protected void onResume() {
        super.onResume();

        mLocFetcher.connect();
        mLocPublisher.connect();

        mTimer = new Timer();
        mTimerTask = new LocationUpdateAndBroadcastTask(mLocFetcher, mLocPublisher);
        mTimer.schedule(mTimerTask, 0, BROADCAST_INTERVAL);
        playSounds();
    }

    @Override
    protected void onPause() {
        super.onPause();
        mLocFetcher.disconnect();
        mLocPublisher.disconnect();
        mTimer.cancel();
        mTimer = null;
    }

    @Override
    protected void onStop() {
        mLocFetcher.disconnect();
        super.onStop();
//        mSoundManager.stop();
    }

    private void playSounds() {
        mSoundManager.play();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String permissions[], int[] grantResults) {
        switch (requestCode) {
            case MY_PERMISSIONS_REQUEST_GET_LOCATION: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//                    mText.setText(mLocFetcher.getLocation().toString());

                } else {
//                    mText.setText("Location disabled. Please enable in Android Settings.");
                }
            }
            case MY_PERMISSIONS_REQUEST_INTERNET: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
//                    mText.setText(mLocFetcher.getLocation().toString());

                } else {
//                    mText.setText("Internet connection disabled. Please enable in Android Settings.");
                }
            }
        }
    }

}
