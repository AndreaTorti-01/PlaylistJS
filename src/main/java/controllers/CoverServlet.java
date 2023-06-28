package controllers;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/cover/*")
public class CoverServlet extends HttpServlet {

    public CoverServlet() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String imageFileName = request.getPathInfo().substring(1); // Extract the file name from the request URL

        if (imageFileName.isEmpty()) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Not possible to upload cover");
        }

        if (imageFileName.contains("%20")) {
            imageFileName = imageFileName.replace("%20", " ");
        }

        String imageFilePath = "C:/userSongs/" + imageFileName;

        File imageFile = new File(imageFilePath);

        if (imageFile.exists()) {
            byte[] imageData;

            try (FileInputStream fileInputStream = new FileInputStream(imageFile);
                 ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {

                byte[] buffer = new byte[4096];
                int bytesRead;

                while ((bytesRead = fileInputStream.read(buffer)) != -1) {
                    byteArrayOutputStream.write(buffer, 0, bytesRead);
                }

                imageData = byteArrayOutputStream.toByteArray();
            }

            response.setContentType("image/jpeg");
            response.setContentLength(imageData.length);

            try (OutputStream outputStream = response.getOutputStream()) {
                outputStream.write(imageData);
            }
        } else {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Not possible to upload cover");
        }

    }
}
