package edu.olin.library.soundscope;

import com.google.android.gms.common.api.GoogleApiClient;
import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.location.LocationServices;


public class LocationFetcher implements GoogleApiClient.ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener {


    GoogleApiClient mGoogleApiClient;
    Context mContext;

    public LocationFetcher(Context context) {
        mContext = context;
        // Create an instance of GoogleAPIClient to access fused location.
        if (mGoogleApiClient == null) {
            mGoogleApiClient = new GoogleApiClient.Builder(mContext)
                    .addConnectionCallbacks(this)
                    .addOnConnectionFailedListener(this)
                    .addApi(LocationServices.API)
                    .build();
        }
    }

    public void connect() {
        mGoogleApiClient.connect();
    }

    public void disconnect() {
        mGoogleApiClient.disconnect();
    }

    public Location getLocation() {
        if (ContextCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            Location loc = LocationServices.FusedLocationApi.getLastLocation(
                    mGoogleApiClient);
            return loc;
        }
        return null;
    }

    public void onConnected(Bundle connectionHint) { }

    public void onConnectionSuspended(int cause) { }

    public void onConnectionFailed(ConnectionResult connectionResult) { }

}
