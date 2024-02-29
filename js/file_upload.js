/**
 * GooTools.net custom JS for file upload
 */

Dropzone.options.ommalashtirishyuklash =
    {
        maxFiles: 1,
        parallelUploads: 1,  // since we're using a global 'currentFile', we could have issues if parallelUploads > 1, so we'll make it = 1
        maxFilesize: 1024*300,   // max individual file size 1024 MB
        chunking: true,      // enable chunking
        forceChunking: true, // forces chunking when file.size < chunkSize
        parallelChunkUploads: false, // allows chunks to be uploaded in parallel (this is independent of the parallelUploads option)
        chunkSize: 10000000,  // chunk size 2,000,000 bytes (~2MB)
        retryChunks: true,   // retry chunks on failure
        retryChunksLimit: 5, // retry maximum of 3 times (default is 3)
        url: upload_url,
        method: 'post',
        headers: {
            'X-CSRF-TOKEN': token
        },
        init: function () {
            this.hiddenFileInput.removeAttribute('multiple');
            this.on("sending", function (file, xhr, formData) {
                formData.append("dataTS", generalTS);
                formData.append("dataDATE", generalDATE);
            });
            this.on("maxfilesexceeded", function (file) {
                this.removeAllFiles();
                this.addFile(file);
            });
            this.on('addedfile', function(file) {
                if (this.files.length > 1) {
                    this.removeFile(this.files[0]);
                }
            });

        },
        renameFile: function (file) {
            var dt = new Date();
            var time = dt.getTime();
            return time + "_" + file.name;
        },
        acceptedFiles: ".jpeg,.png,.jpg,.gif,.svg,.doc,.docx,.pdf,.ppt,.pptx,.mp4,.mp3,.avi,.flv,.mov,.wmv,.3gp,.mkv,.webm,.ogg,.ogv,.mpg,.mpeg,.zip",
        addRemoveLinks: true,
        timeout: 50000,
        removedfile: function (file) {
            var name = file.upload.filename;
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': token
                },
                type: 'POST',
                url: deleteAction,
                data: {
                    filename: name,
                    ts: generalTS,
                    date: generalDATE,
                },
                success: function (data) {
                    console.log("File has been successfully removed!!");
                },
                error: function (e) {
                    console.log(e);
                }
            });
            var fileRef;
            return (fileRef = file.previewElement) != null ?
                fileRef.parentNode.removeChild(file.previewElement) : void 0;
        },

        success: function (file) {
            if (file.previewElement) {
                var result = jQuery.parseJSON(file.xhr.response)
                if (result.path) {
                  //  console.log('success');
                  //  console.log(result);
                    $('#post_file').val(result.path + result.name)
                }
                return file.previewElement.classList.add("dz-success");
            }
        },
        complete(file) {
            if (file._removeLink) {
                file._removeLink.innerHTML = this.options.dictRemoveFile;
            }
            if (file.previewElement) {
                var result = jQuery.parseJSON(file.xhr.response)
               // console.log('complete');
                if (result.path) {
                   // console.log(result);
                    $('#post_file').val(result.path + result.name)
                }
                return file.previewElement.classList.add("dz-complete");
            }
        },
        error: function (file, response) {
            return false;
        },
        chunksUploaded: (file, done) => {
            /* set progress width to 100% */
            console.log('chunksUploaded');
            console.log(file);
            if (file.previewElement) {
                var result = jQuery.parseJSON(file.xhr.response)
                if (result.path) {
                    console.log('success');
                    //  console.log(result);
                    console.log(result);
                    $('#post_file').val(result.path + result.name)
                }
            }
            done()
        },
        dictRemoveFile: removeMessage,
    };

