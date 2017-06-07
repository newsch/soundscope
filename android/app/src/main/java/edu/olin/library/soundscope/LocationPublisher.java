package edu.olin.library.soundscope;


import android.location.Location;
import android.util.Log;

import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

import org.json.JSONObject;

public class LocationPublisher {

    private Socket mSocket;
    private String mUUID;

    public LocationPublisher(Socket socket, String UUID) {
        mSocket = socket;
        mUUID = UUID;
    }

    public void connect() {
        mSocket.connect();
    }

    public void disconnect() {
        mSocket.disconnect();
    }

    public void publishLocation(Location location) {
        // Convert the Location object into a JSON object
        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("id", mUUID);
        map.put("lon", location.getLongitude());
        map.put("lat", location.getLatitude());

        String json = new JSONObject(map).toString();

        Log.d("publishLocation", "Emitting current location. JSON: " + json);
        // Send a string representation of the JSON object across the Internet
        mSocket.emit("position", json);
        Log.d("publishLocation", "Current location emitted successfully.");
    }


}
