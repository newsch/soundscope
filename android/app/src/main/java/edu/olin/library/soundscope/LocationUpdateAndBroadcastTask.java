package edu.olin.library.soundscope;

import android.location.Location;

public class LocationUpdateAndBroadcastTask extends java.util.TimerTask {

    LocationFetcher mLocFetcher;
    LocationPublisher mLocPub;

    public LocationUpdateAndBroadcastTask(LocationFetcher locationFetcher, LocationPublisher locationPublisher) {
        mLocFetcher = locationFetcher;
        mLocPub = locationPublisher;
    }

    @Override
    public void run() {
        Location currentLocation = mLocFetcher.getLocation();
        if (currentLocation != null) {
            mLocPub.publishLocation(currentLocation);
        }
    }
}
