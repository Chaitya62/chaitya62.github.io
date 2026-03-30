FROM ruby:2.7

WORKDIR /site

RUN apt-get update \
  && apt-get install -y --no-install-recommends build-essential git libssl-dev pkg-config \
  && rm -rf /var/lib/apt/lists/*

RUN gem install bundler:2.4.22

COPY Gemfile Gemfile.lock jekyll-theme-cayman-blog.gemspec ./
COPY . .

RUN bundle install

EXPOSE 4000

CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--livereload"]
