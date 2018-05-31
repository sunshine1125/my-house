const express = require('express');
const apiRoutes = express.Router();
// 引入Multiparty解析表单
const multer = require('multer');
const Posts = require('../models/post');
const md = require('markdown-it')();
const qingstor = require('../tools/qingstor');
const fs = require('fs');

let config = process.env.NODE_ENV === 'development' ? require('../config/dev') : require('../config/prod');
let env = config.qingstor;

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'public/uploads')
  },
  filename   : (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
});
const upload = multer({storage: storage});

apiRoutes.post('/post/uploadImage', upload.single('file'), (req, res) => {
  qingstor.uploadObject(env, req.file.filename, req.file.path, req.file.mimetype).then(res => {
    let folder = fs.existsSync('public/uploads');
    if (folder) {
      let dirList = fs.readdirSync('public/uploads');
      dirList.forEach((fileName) => {
        fs.unlinkSync(`public/uploads/${fileName}`) // 删除uploads文件夹内容
      })
    }
    return res.url;
  }).then(url => {
    res.json({success: true, path: url});
  });
});

// uploadToQingStor = (sourcePathFile, dest) => {
//   qingstor.uploadObject(sourcePathFile, dest)
// }

// try {
//   const res = await uploadToQingStor(sourcePathFile, dest);
//   if (res.statusText === 'CREATED') {
//     log(`Upload ${fileName} to qingstor success, the path is ${dest}`);
//   }
// } catch (error) {
//   log('QY upload error: ' + error);
// }
// get user's post
apiRoutes.get('/post/get/:id', (req, res) => {
  let userId = req.params.id;
  let matchData = [];
  Posts.find()
    .populate({path: 'uid'})
    .exec((err, data) => {
    // console.log(data)
      data.forEach(item => {
        if (item.uid._id == userId) {
          matchData.push(item);
        }
      });
      // console.log(matchData)
      res.status('200').json(matchData);
    });
});

apiRoutes.get('/post/getAllArticles', (req, res) => {
  Posts.find()
    .exec((err, posts) => {
      posts.forEach((post) => {
        post.content = md.render(post.content);
      })
      res.status('200').json({success: true, data: posts});
    })
})

// get Detail post
apiRoutes.get('/post/getDetailPost/:id', (req, res) => {
  let postId = req.params.id;
  Posts.findOne({_id: postId})
    .exec((err, post) => {
      post.content = md.render(post.content);
      res.status('200').json(post);
    });
});

// get Single post
apiRoutes.get('/post/getSinglePost/:id', (req, res) => {
  let postId = req.params.id;
  Posts.findOne({_id: postId})
    .exec((err, post) => {
      res.status('200').json(post);
    });
});

apiRoutes.post('/post/add/:id', (req, res, next) => {
  let userId = req.params.id;
  let title = req.body.title;
  let date = req.body.date;
  let image = req.body.image;
  let content = req.body.content;
  let tagTitle = req.body.tagTitle;
  let tagId = req.body.tagId;
  Posts.findOne({title: title}, (err, data) => {
    if (err) {
      return next(err);
    }
    if (data) {
      res.status('200').json({success: false, code: 100, msg: '数据已经存在'})
    }
    let newForm = new Posts({
      image   : image,
      title   : title,
      tagTitle: tagTitle,
      content : content,
      date    : date,
      uid     : userId,
      tagId   : tagId,
      likeNum : 0
    });
    newForm.save(next);

  });
}, (req, res) => {
  res.status('200').json({code: 200, success: true});
});

apiRoutes.put('/post/:id/like', (req, res) => {
  Posts.findByIdAndUpdate(req.params.id, {
    likeNum: req.body.likeNum
  }, (err, docs) => {
    if (err) {
      // console.log(err);
    }
    res.status('200').json({code: 200, msg: '数据更新成功'})
  });
});

apiRoutes.put('/post/:id/like', (req, res) => {
  Posts.findByIdAndUpdate(req.params.id, {
    likeNum: req.body.likeNum
  }, (err, docs) => {
    if (err) {
      // console.log(err);
    }
    res.status('200').json({code: 200, msg: '数据更新成功'})
  });
});

apiRoutes.put('/post/edit/:id', (req, res) => {
  Posts.findByIdAndUpdate(req.params.id, {
    title   : req.body.title,
    content : req.body.content,
    tagTitle: req.body.tagTitle,
    tagId   : req.body.tagId,
    image   : req.body.image
  }, (err, docs) => {
    if (err) {
      // console.log(err);
    }
    res.status('200').json({code: 200, msg: '数据更新成功'})
  });
});

apiRoutes.delete('/post/remove/:id', (req, res) => {
  Posts.remove({_id: req.params.id}, (err, docs) => {
    if (err) {
      // console.log(err);
    }
    res.status('200').json({success: true, code: 200, msg: '删除成功'})
  })

});

apiRoutes.get('/getArticlesByTag/:id', (req, res) => {
  Posts.find({tagId: req.params.id}, (err, data) => {
    if (err) {

    } else {
      res.status('200').json({success: true, data: data});
    }

  })

})

module.exports = apiRoutes;
